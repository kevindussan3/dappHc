alert('hola')


// import getWeb3 from "../helpers/getWeb3";


//////////////////////////////////////////////////////////////////////////////////|
//        CONTRACT ADDRESS           &          CONTRACT ABI                      |
//////////////////////////////////////////////////////////////////////////////////|                                                             |
// const CONTRACT_ADDRESS = require("../contracts/Auction.json").networks[5777].address
// const CONTRACT_ABI = require("../contracts/Auction.json").abi;
// const CONTRACT_NAME = require("../contracts/Auction.json").contractName
// const CONTRACT_ADDRESS =  require('.')
// http://localhost/Dapp/web/

fetch('http://localhost/Dapp/web/contracts/HistoriaClinica.json')
.then(response => response.json())
.then(async data => {

  // // Get network provider and web3 instance.
  const web3 = new Web3(window.ethereum);

  // // Use web3 to get the user's accounts.
  const accounts = await web3.eth.getAccounts();
  console.log("==",accounts)
  const networkId = await web3.eth.net.getId();
  console.log(networkId)
  const deployedNetwork = data.networks[networkId];
  console.log(deployedNetwork)
  const instance = new web3.eth.Contract(
    data.abi,
    deployedNetwork && deployedNetwork.address,
  );
  
  console.log("isD+octor",accounts);
  instance.methods.isDoctor(accounts[0]).call((error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log(result); // true si el médico está autorizado, false de lo contrario
    }
  });

  // Aquí puedes acceder a las propiedades del objeto JSON utilizando la variable "data"
  // console.log(data.networks[5777].address);
  // console.log(data.propiedad2);
});
