const chai = require("chai");
const User = require("./user");
const expect = chai.expect;

let user = require("./user");

describe.only("user model", () => {
  it("shoul return error with required ares are missing", (done) => {
    let user = new User();

    user.validate((err) => {
      expect(err.errors.name).to.exist;
      expect(err.errors.email).to.exist;
      expect(err.errors.age).to.not.exist;

      done();
    });
  });

  it("should have optional age filed", (done) => {
    let user = new User({
      name: "pier",
      email: "pier@pier.com",
      age: 39,
    });

    expect(user).to.have.been.property("age").to.equal(39);
    expect(user).to.have.been.property("email").to.equal("pier@pier.com");
    expect(user).to.have.been.property("name").to.equal("pier");
    done();
  });
});
