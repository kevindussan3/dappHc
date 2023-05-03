/* eslint-disable */

import React from "react";
import "./App.css";

import getWeb3 from "../helpers/getWeb3";

import historiaClinicaContract from "../contracts/HistoriaClinica.json";

class App extends React.Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    patientName: "",
    patientAge: 0,
    patientGender: "",
    isDoctor: false,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = historiaClinicaContract.networks[networkId];
      const instance = new web3.eth.Contract(
        historiaClinicaContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });

      // Check if the user is a doctor
      const isDoctor = await instance.methods.isDoctor(accounts[0]).call();
      this.setState({ isDoctor });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { contract, accounts, patientName, patientAge, patientGender } = this.state;

    // Call the contract method to add a patient record
    await contract.methods
      .agregarPaciente(patientName, patientAge, patientGender)
      .send({ from: accounts[0] });

    // Clear the form
    this.setState({ patientName: "", patientAge: 0, patientGender: "" });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <h1>Historia Clínica</h1>
        <p>
          Add a new patient record:
        </p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="patientName"
              value={this.state.patientName}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              name="patientAge"
              value={this.state.patientAge}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Gender:
            <input
              type="text"
              name="patientGender"
              value={this.state.patientGender}
              onChange={this.handleChange}
            />
          </label>
          <button type="submit">Add Record</button>
        </form>
        {this.state.isDoctor && (
          <div>
            <p>You are a doctor.</p>
            <button>View Patients</button>
          </div>
        )}
      </div>
    );
  }
}

export default App;
