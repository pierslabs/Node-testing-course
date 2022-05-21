const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

const mongoose = require("mongoose");
const users = require("./users");
const User = require("./models/user");

let sandbox = sinon.createSandbox();
describe.only("users", () => {
  let findStub;
  let deleteStub;
  let sampleArgs;
  let sampleUser;

  beforeEach(() => {
    sampleUser = {
      id: 12345,
      name: "Pier",
      emai: "pier@[pier.com",
      age: 35,
    };
    findStub = sandbox.stub(mongoose.Model, "findById").resolves(sampleUser);
    deleteStub = sandbox
      .stub(mongoose.Model, "remove")
      .resolves("fake_remove_result");
  });

  afterEach(() => {
    sandbox.restore();
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
});
