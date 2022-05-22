const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");

const mongoose = require("mongoose");
let users = rewire("./users");
let User = require("./models/user");
let mailer = require("./mailer");

let sandbox = sinon.createSandbox();
describe("users", () => {
  let findStub;
  let deleteStub;
  let sampleArgs;
  let sampleUser;
  let mailerStub;

  beforeEach(() => {
    sampleUser = {
      id: 12345,
      name: "Pier",
      email: "pier@pier.com",
      age: 35,
      save: sandbox.stub().resolves(),
    };
    findStub = sandbox.stub(mongoose.Model, "findById").resolves(sampleUser);
    deleteStub = sandbox
      .stub(mongoose.Model, "remove")
      .resolves("fake_remove_result");
    mailerStub = sandbox.stub(mailer, "sendWelcomeEmail").resolves("Fake_mail");
  });

  afterEach(() => {
    sandbox.restore();
    users = rewire("./users");
  });

  context("get", () => {
    it("should check for an id", (done) => {
      users.get(null, (err, res) => {
        expect(err).to.exist;
        expect(err.message).to.equal("Invalid user id");
        done();
      });
    });
    it("should call findUserByID with id and return result", (done) => {
      sandbox.restore();
      let stub = sandbox
        .stub(mongoose.Model, "findById")
        .yields(null, { name: "Pier" });
      users.get(12345, (err, result) => {
        expect(err).to.not.exist;
        expect(stub).to.have.been.calledOnce;
        expect(stub).to.have.been.calledWith(12345);
        expect(result).to.be.a("object");
        expect(result).to.have.property("name").to.equal("Pier");

        done();
      });
    });

    it("should catch error if there is one", (done) => {
      sandbox.restore();
      let stub = sandbox
        .stub(mongoose.Model, "findById")
        .yields(new Error("fake"));

      users.get(123, (error, result) => {
        expect(result).to.not.exist;
        expect(error).to.exist;
        expect(error).to.be.instanceof(Error);
        expect(stub).to.have.been.calledWith(123);
        expect(error.message).to.equal("fake");

        done();
      });
    });
  });

  context("delete user", () => {
    it("should check for an id using return", () => {
      return users
        .delete()
        .then((res) => {
          throw new Error("unexpected succes");
        })
        .catch((err) => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.equal("Invalid id");
        });
    });

    it("should check for error using eventually", () => {
      return expect(users.delete()).to.eventually.be.rejectedWith("Invalid id");
    });

    it("should call User remove", async () => {
      const result = await users.delete(12345);
      expect(result).to.equal("fake_remove_result");
      expect(deleteStub).to.have.been.calledWith({ _id: 12345 });
    });
  });

  context("create user", () => {
    let FakeUserClass;
    let saveStub;
    let result;

    beforeEach(async () => {
      saveStub = sandbox.stub().resolves(sampleUser);
      FakeUserClass = sandbox.stub().returns({ save: saveStub });

      users.__set__("User", FakeUserClass);
      result = await users.create(sampleUser);
    });

    it("rejected invalid args", async () => {
      await expect(users.create()).to.be.eventually.rejectedWith(
        "Invalid arguments"
      );
      await expect(
        users.create({ name: "Pier" })
      ).to.be.eventually.rejectedWith("Invalid arguments");
      await expect(
        users.create({ email: "pier@pier.com" })
      ).to.be.eventually.rejectedWith("Invalid arguments");
    });

    it("should call user with new", () => {
      expect(FakeUserClass).to.have.been.calledWithNew;
      expect(FakeUserClass).to.have.been.calledWith(sampleUser);
    });

    it('"should save user', () => {
      expect(saveStub).to.have.been.called;
    });

    it("should call mailer with email && name", () => {
      expect(mailerStub).to.have.been.calledWith(
        sampleUser.email,
        sampleUser.name
      );
    });

    it("should rejects errors", async () => {
      saveStub.rejects(new Error("fake"));

      await expect(users.create(sampleUser)).to.eventually.rejectedWith("fake");
    });
  });

  context("users update", () => {
    it("should find user by id", async () => {
      await users.update(12345, { age: 35 });
      expect(findStub).to.have.been.calledWith(12345);
    });

    it("should user save", async () => {
      await users.update(12345, { age: 35 });
      expect(sampleUser.save).to.have.been.calledOnce;
    });

    it("should rejects if there is an error", async () => {
      findStub.throws(new Error("fake"));

      await expect(
        users.update(12345, { age: 35 })
      ).to.eventually.be.rejectedWith("fake");
    });
  });
});
