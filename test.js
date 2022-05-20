const assert = require("assert");

describe("first test", () => {
  before(() => {
    console.log("================before");
  });

  after(() => {
    console.log("================after");
  });

  beforeEach(() => {
    console.log("================beforeEach");
  });

  afterEach(() => {
    console.log("================AfterEach");
  });

  context("function tested", () => {
    it("should do something", () => {
      assert.equal(1, 1);
    });

    it("should do something", () => {
      assert.deepEqual({ name: "Pier" }, { name: "Pier" });
    });

    it("this a pending test");
  });
});
