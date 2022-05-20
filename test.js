const assert = require("assert");

describe("first test", () => {
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
