const assert = require("assert");

describe("first test", () => {
  context("function tested", () => {
    // before(() => {
    //   console.log("================before");
    // });

    // after(() => {
    //   console.log("================after");
    // });

    // beforeEach(() => {
    //   console.log("================beforeEach");
    // });

    // afterEach(() => {
    //   console.log("================AfterEach");
    // });

    it("should do something", () => {
      assert.equal(1, 1);
    });

    it("should do something else", () => {
      assert.deepEqual({ name: "Pier" }, { name: "Pier" });
    });

    it("this a pending test");
  });

  // multiple context
  context("another function", () => {
    it("should something 2");
  });
});
