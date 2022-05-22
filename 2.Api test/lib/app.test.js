const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");
const request = require("supertest");

let app = rewire("./app");
let users = require("./users");
const auth = require("./auth");
let sandbox = sinon.createSandbox();

describe("app", () => {
  afterEach(() => {
    app = rewire("./app");
    sandbox.restore();
  });

  context("get", () => {
    it("should get", (done) => {
      request(app)
        .get("/")
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property("name").to.equal("Foo Fooing Bar");
          done(err);
        });
    });

    it("should post", (done) => {
      const createStub = sandbox.stub(users, "create").resolves({ name: "Pier" });
      request(app)
        .post("/user")
        .expect(200)
        .end((err, res) => {
          expect(createStub).to.have.been.calledOnce;
          expect(res.body).to.have.property("name").to.equal("Pier");
          done(err);
        });
    });

    it("should handle error on error", (done) => {
      const createStub = sandbox.stub(users, "create").rejects(new Error("fake error"));
      const errorStub = sandbox.stub().callsFake((res, error) => {
        return res.status(400).json({ error: "fake" });
      });

      app.__set__("handleError", errorStub);

      request(app)
        .post("/user")
        .send({ name: "fake" })
        .expect(400)
        .end((err, res) => {
          expect(createStub).to.have.been.calledOnce;
          expect(errorStub).to.have.been.calledOnce;
          expect(res.body).to.have.property("error").to.equal("fake");
          done(err);
        });
    });
  });

  context("delete", () => {
    let authStub, deleteStub;
    beforeEach(() => {
      fakeAuth = (req, res, next) => {
        return next();
      };

      authStub = sandbox.stub(auth, "isAuthorized").callsFake(fakeAuth);

      app = rewire("./app");
    });

    it("should calls auth middleware check function users delete succes", (done) => {
      deleteStub = sandbox.stub(users, "delete").resolves("fake_delete");

      request(app)
        .delete("/user/55")
        .expect(200)
        .end((err, res) => {
          expect(authStub).to.have.been.calledOnce;
          expect(deleteStub).to.have.been.calledWithMatch({ id: "55", name: "foo" });
          expect(res.body).to.equal("fake_delete");
          done(err);
        });
    });
  });

  context("handle error", () => {
    let handleError, res, statusStub, jsonStub;

    beforeEach(() => {
      jsonStub = sandbox.stub().returns("done");
      statusStub = sandbox.stub().returns({
        json: jsonStub,
      });

      res = {
        status: statusStub,
      };

      handleError = app.__get__("handleError");
    });

    it("should check error instance app handle error and  format msg", (done) => {
      let result = handleError(res, new Error("fake error"));

      expect(statusStub).to.have.been.calledWith(400);
      expect(jsonStub).to.have.have.been.calledWith({
        error: "fake error",
      });

      done();
    });

    it("should return object without changing it if not instance of error", (done) => {
      let result = handleError(res, { id: 1, message: "fake error" });

      expect(statusStub).to.have.been.calledWith(400);
      expect(jsonStub).to.have.been.calledWith({ id: 1, message: "fake error" });

      done();
    });
  });
});
