// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
// var Auction = artifacts.require("./Auction.sol");
var HistoriaClinica = artifacts.require("./HistoriaClinica.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  // deployer.deploy(Auction);
  deployer.deploy(HistoriaClinica);
};
