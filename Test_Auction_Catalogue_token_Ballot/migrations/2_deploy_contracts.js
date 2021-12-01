var catalogue = artifacts.require("./catalogue.sol");
var TodoList = artifacts.require("./TodoList.sol");
var Coin = artifacts.require("./Coin.sol");
var Ballot = artifacts.require("./Ballot.sol");


module.exports = function(deployer) {
deployer.deploy(TodoList);      
deployer.deploy(catalogue);
deployer.deploy(Coin);
deployer.deploy(Ballot);

};


