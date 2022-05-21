const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const demo = require("./demo");

describe("demo", () => {
  context("add", () => {
    it("should add two numbers", () => {
      expect(demo.add(1, 2)).to.equal(3);
    });
  });

  context("callback add", () => {
    it("should test callback callback", (done) => {
      demo.addCallback(1, 2, (err, result) => {
        expect(err).to.not.exist;
        expect(result).to.equal(3);
        done();
      });
    });
  });

  context("callback add", () => {
    it("should test callback callback", (done) => {
      demo
        .addPromise(1, 2)
        .then((result) => {
          expect(result).to.equal(3);
          done();
        })
        .catch((ex) => {
          console.log("caught err");
          done(ex);
        });
    });

    it("should test callback callback", () => {
      demo.addPromise(1, 2).then((result) => {
        expect(result).to.equal(3);
      });
    });

    it("should test promise async await", async () => {
      let result = await demo.addPromise(1, 2);
      expect(result).to.equal(3);
    });

    it("should test promise chai-as-promised", async () => {
      return expect(demo.addPromise(1, 2)).to.eventually.equal(3);
    });
  });

  context(" test doubles", () => {
    it("should spy on log", () => {
      const spy = sinon.spy(console, "log");
      demo.foo();
      // sinon
      expect(spy.calledOnce).to.be.true;
      // sinon-chai
      expect(spy).to.have.been.calledOnce;

      //Always restore the spy, it can give errors in other tests
      spy.restore();
    });
  });
});
