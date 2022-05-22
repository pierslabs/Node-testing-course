const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);

let crypto = require("crypto");
let config = require("./config");
let utils = require("./utils");
let sandbox = sinon.createSandbox();

describe.only("utils", () => {
  let secretStub, digestStub, updateStub, createHashStub, hash;

  beforeEach(() => {
    secretStub = sandbox.stub(config, "secret").returns("fake_secret");
    digestStub = sandbox.stub().returns("ABC123");
    updateStub = sandbox.stub().returns({
      digest: digestStub,
    });

    createHashStub = sandbox.stub(crypto, "createHash").returns({
      update: updateStub,
    });

    hash = utils.getHash("fake");
  });

  afterEach(() => {
    sandbox.restore();
  });
  it("should return null if a invalid string is passed", () => {
    sandbox.reset();

    let hash2 = utils.getHash(123);
    let hash3 = utils.getHash({ name: "pi" });
    let hash4 = utils.getHash(null);

    expect(hash2).to.be.null;
    expect(hash3).to.be.null;
    expect(hash4).to.be.null;

    expect(createHashStub).to.not.have.been.called;
  });

  it("should get secret from config", () => {
    expect(secretStub).to.have.been.called;
  });

  it("should call crypto with correct settings and returns hash", () => {
    expect(createHashStub).to.have.been.calledWith("md5");
    expect(updateStub).to.have.been.calledWith("fake_fake_secret");
    expect(digestStub).to.have.been.calledWith("hex");

    expect(hash).to.equal("ABC123");
  });
});
