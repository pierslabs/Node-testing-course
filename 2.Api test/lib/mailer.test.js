const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.use(sinonChai);
const rewire = require("rewire");

let sandbox = sinon.createSandbox();
let mailer = rewire("./mailer");

describe("mailer", () => {
  let emailStub;

  beforeEach(() => {
    emailStub = sandbox.stub().resolves("done");
    mailer.__set__("sendEmail", emailStub);
  });

  afterEach(() => {
    sandbox.restore();
    mailer = rewire("./mailer");
  });

  context("sendWelcomeEmail", () => {
    it("should check foremail and name", async () => {
      await expect(mailer.sendWelcomeEmail()).to.eventually.be.rejectedWith(
        "Invalid input"
      );
      await expect(
        mailer.sendWelcomeEmail({ email: "pi@pi.com" })
      ).to.eventually.be.rejectedWith("Invalid input");
    });

    it("should call sendEmail with email && message", async () => {
      await mailer.sendWelcomeEmail("pi@pi.com", "pier");
      expect(emailStub).to.have.been.calledWith(
        "pi@pi.com",
        "Dear pier, welcome to our family!"
      );
    });
  });

  context("sendPasswordResetEmail", () => {
    it("should check for email ", async () => {
      await expect(
        mailer.sendPasswordResetEmail()
      ).to.eventually.be.rejectedWith("Invalid input");
    });

    it("should call reset Email with email && message", async () => {
      await mailer.sendPasswordResetEmail("pi@pi.com");
      expect(emailStub).to.have.been.calledWith(
        "pi@pi.com",
        "Please click http://some_link to reset your password."
      );
    });
  });

  context("send email", () => {
    let sendEmail;

    beforeEach(() => {
      mailer = rewire("./mailer");
      sendEmail = mailer.__get__("sendEmail");
    });

    it("should check for email and body", async () => {
      await expect(sendEmail()).to.eventually.be.rejectedWith("Invalid input");
      await expect(sendEmail("pi@pi.com")).to.eventually.be.rejectedWith(
        "Invalid input"
      );
    });

    it("should call sendEmail with email && body", async () => {
      let result = await sendEmail("pier@pi.com", "welcome");
      expect(result).to.equal("Email sent");
    });
  });
});
