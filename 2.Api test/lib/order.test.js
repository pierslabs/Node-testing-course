const { use } = require("chai");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const sononChai = require("sinon-chai");
chai.use(sinonChai);
let Order = require("./order");
let sandbox = sinon.createSandbox();

describe.only("orders", () => {
  let warnStub, dateSpy, user, items, o;

  beforeEach(() => {
    warnStub = sandbox.stub(console, "warn");
    dateSpy = sandbox.spy(Date, "now");
    user = { id: 1, name: "Pier" };
    items = [
      { name: "Book", price: 15 },
      { name: "Watch", price: 3 },
    ];

    o = new Order(123, user, items);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create instance of order and calculate total + shiping", () => {
    expect(o).to.be.instanceof(Order);
    expect(dateSpy).to.have.been.calledTwice;
    expect(o).to.have.property("ref").to.equal(123);
    expect(o).to.have.property("user").to.deep.equal(user);
    expect(o).to.have.property("items").to.deep.equal(items);
    expect(o).to.have.property("status").to.be.equal("Pending");
    expect(o).to.have.property("createdAt").to.deep.a("Number");
    expect(o).to.have.property("updatedAt").to.deep.a("Number");
    expect(o).to.have.property("shipping").to.deep.equal(5);
    expect(o).to.have.property("subtotal").to.deep.equal(18);
    expect(o).to.have.property("total").to.deep.equal(23);

    expect(o.save).to.be.a("function");
    expect(o.cancel).to.be.a("function");
    expect(o.ship).to.be.a("function");
  });

  it("should update status to active and return order details", () => {
    let result = o.save();

    expect(dateSpy).to.have.been.calledThrice;
    expect(o.status).to.equal("Active");
    expect(result).to.be.a("Object");
    expect(result).to.have.property("user").to.equal("Pier");
    expect(result).to.have.property("updatedAt").to.be.a("Number");
    expect(result).to.have.property("items").to.deep.equal(items);
    expect(result).to.have.property("shipping").to.be.equal(5);
    expect(result).to.have.property("total").to.be.equal(23);
  });

  it("should cancel order", () => {
    let result = o.cancel();
    expect(warnStub).to.have.been.calledWith("Order cancelled");
    expect(dateSpy).to.have.been.calledThrice;
    expect(o.status).to.equal("Cancelled");
    expect(result).to.be.true;
    expect(o).to.have.been.property("shipping").to.be.equal(0);
    expect(o).to.have.been.property("total").to.be.equal(0);
  });

  it("should update status ship order", () => {
    o.ship();
    expect(o.status).to.equal("Shipped");
    expect(dateSpy).to.have.been.calledThrice;
  });
});
