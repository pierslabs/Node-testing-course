const chai = require("chai");
const expect = chai.expect;

describe("chai test", () => {
  it("should compare some values", () => {
    expect(1).to.eq(1);
  });

  it("should test something", () => {
    expect({ name: "Pier" }).to.deep.equal({ name: "Pier" });
    expect({ name: "Pier" }).to.have.property("name").to.equal("Pier");
    expect(5 > 8).to.be.false;
    expect({}).to.be.a("object");
    expect("Li").to.be.a("string");
    expect(3).to.be.a("number");
    expect("bar").to.be.a("string").with.lengthOf(3);
    expect([1, 2, 3].length).to.equal(3);
    expect(null).to.be.null;
    expect(undefined).to.not.exist;
    expect(1).to.exist;
  });
});
