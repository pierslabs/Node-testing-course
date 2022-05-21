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
  });
});
