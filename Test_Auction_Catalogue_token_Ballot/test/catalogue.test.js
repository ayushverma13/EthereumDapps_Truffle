var catalogue = artifacts.require("./catalogue.sol");

contract("catalogue", function(accounts) {
  var catalogueInstance;
  it("contract deployment", function() {
    return catalogue.deployed().then(function (instance) {
        catalogueInstance = instance;
      assert(catalogueInstance !== undefined, 'Coin contract should be defined');
    });
  });

  it("should initialize with two candidates", function() {
    return catalogue.deployed().then(function(instance) {
      return instance.itemCount();
    }).then(function(count) {
      assert.equal(count, 2);
    });
  });

  it("it initializes the candidates with the correct values", function() {
    return catalogue.deployed().then(function(instance) {
      catalogueInstance = instance;
      return catalogueInstance.itemsAvail(1);
    }).then(function(item) {
        console.log(item[0])
        console.log(item[1])
        console.log(item[2])
        console.log(item[3])
        console.log(item[4].toString())
        console.log(item[5])
        console.log(item[6])
      assert.equal(item[5], 1, "contains the correct id");
      assert.equal(item[1], " Medicine 1 ", "contains the correct Description");
      assert.equal(item[3], "141012", "contains the correct pin");
      return catalogueInstance.itemsAvail(2);
    }).then(function(item) {
      assert.equal(item[5], 2, "contains the correct id");
      assert.equal(item[1], " Medicine 2 ", "contains the correct Description");
      assert.equal(item[3], "576104", "contains the correct pin");
    });
  });
});