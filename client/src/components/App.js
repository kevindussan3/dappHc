import React from "react";
import getWeb3 from "../helpers/getWeb3";
import historiaClinicaContract from "../contracts/HistoriaClinica.json";


// const CONTRACT_ADDRESS = require("../contracts/Auction.json").networks[5777].address
// const CONTRACT_ABI = require("../contracts/Auction.json").abi;
// const CONTRACT_NAME = require("../contracts/Auction.json").contractName
// const CONTRACT_ADDRESS =  require('.')
class App extends React.Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    patientName: "",
    patientAge: 0,
    patientGender: "",
    patientGender: "",
    patientGender: "",
    isDoctor: false,
  };

  componentDidMount = async () => {
    try {
      // // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)

      // // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const CONTRACT_ADDRESS = historiaClinicaContract.networks[networkId].address;
      console.log(CONTRACT_ADDRESS)
      const CONTRACT_ABI = historiaClinicaContract.abi
      console.log(CONTRACT_ABI)
      const CONTRACT_NAME = historiaClinicaContract.contractName
      console.log(CONTRACT_NAME)
      const contrato = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      console.log(contrato)





      // console.log(deployedNetwork)
      // const instance = new web3.eth.Contract(
      //   historiaClinicaContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      // // Set web3, accounts, and contract to the state, and then proceed with an
      // // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: contrato });
      console.log(accounts[0])
      // // // Check if the user is a doctor
      contrato.methods.isDoctor(accounts[0]).call()
        .then(result => {
          console.log("isDoctor", result);
          this.setState({ isDoctor: result });
        })
        .catch(error => console.log(error));

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChange = (event) => {
    // this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async (event) => {
    // event.preventDefault();

    // const { contract, accounts, patientName, patientAge, patientGender } = this.state;

    // // Call the contract method to add a patient record
    // await contract.methods
    //   .agregarPaciente(patientName, patientAge, patientGender)
    //   .send({ from: accounts[0] });

    // // Clear the form
    // this.setState({ patientName: "", patientAge: 0, patientGender: "" });
  };

  handleAutorizarMedicoSubmit = async (event) => {
    event.preventDefault();
    const { contract, accounts } = this.state;
    const addressMedico = '0x096c30d99cCeF860784a3A5C5eD2f076f30fD783'; // DirecciÛn del paciente
    // const addressMedico = '0x74D4F9091da679C78f3293180e3acc229BBB72dB'; // DirecciÛn del paciente
    const nombre = 'Juan Perez';
    const especialidad = 'General';
    contract.methods.agregarMedico(addressMedico, nombre, especialidad, true)
      .send({ from: accounts[0] })
      .then((gasEstimado) => {
        console.log('Gas estimado:', gasEstimado);
      })
    event.target.reset();
  };

  handleAgregaPacienteSubmit = async (event) => {
    event.preventDefault();
    const { contract, accounts } = this.state;

    const direccionPaciente = '0xB8e2813287a85bFC6E3688e69b9f3AbC6C3A690a'; // DirecciÛn del paciente
    const nombre = 'Juan Perez';
    const edad = 35;
    const diagnostico = 'Dolor de cabeza';
    contract.methods.agregarPaciente(direccionPaciente, nombre, edad, diagnostico).send({ from: accounts[0] })
      .then((gasEstimado) => {
        console.log('Gas estimado:', gasEstimado);
      });

    event.target.reset();
  };


  handleAutorizarMedicoPacienteSubmit = async (event) => {
    event.preventDefault();
    const { contract, accounts } = this.state;
    console.log(accounts)
    const addressMedico = '0x74D4F9091da679C78f3293180e3acc229BBB72dB'; 
    const direccionPaciente = '0xB8e2813287a85bFC6E3688e69b9f3AbC6C3A690a';
    contract.methods.autorizarMedico(addressMedico, direccionPaciente)
      .send({ from: accounts[0] })
      .then((gasEstimado) => {
        console.log('Gas estimado:', gasEstimado);
      })

    event.target.reset();
  };



  handleObtenerInformacionPacienteSubmit = async (event) => {
    event.preventDefault();


    const { contract, accounts } = this.state;

    // console.log(contract, accounts)
    // const doctorAddress = event.target.doctorAddress.value;
    // const pacienteAddress = event.target.pacienteAddress.value;
    // console.log(doctorAddress, pacienteAddress)
    // // // Llamar a la funci√≥n autorizarMedico del contrato
    // await contract.methods
    //   .autorizarMedico(doctorAddress, pacienteAddress)
    //   .estimateGas({ from: accounts.address })
    //   .then((gasEstimado) => {
    //     console.log('Gas estimado:', gasEstimado);
    //   });

    //     // // Limpiar los campos del formulario

    const direccionPaciente = '0xB8e2813287a85bFC6E3688e69b9f3AbC6C3A690a';
    contract.methods.obtenerInformacionPaciente(direccionPaciente).call()
            .then(result => {
              console.log("isDoctor", result);
              this.setState({ isDoctor: result });
            })
            .catch(error => console.log(error));





    event.target.reset();
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div>
        <h1>Historia Cl√≠nica</h1>
        <p>
          Add a new patient record:
        </p>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="patientName">Patient Name:</label>
          <input type="text" name="patientName" value={this.state.patientName} onChange={this.handleChange} />
          <br />
          <label htmlFor="patientAge">Patient Age:</label>
          <input type="number" name="patientAge" value={this.state.patientAge} onChange={this.handleChange} />
          <br />
          <label htmlFor="patientGender">Patient Gender:</label>
          <select name="patientGender" value={this.state.patientGender} onChange={this.handleChange}>
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
          <br />
          <button type="submit">Add Patient</button>
        </form>
        {this.state.isDoctor ? (
          <div>
            <h2>Patient Records:</h2>
            {/* TODO: Display patient records */}
          </div>
        ) : (
          <p>You are not authorized to view patient records</p>
        )}

        {/* <form onSubmit={this.handleAutorizacionSubmit}>
          <label htmlFor="patientName">Doctor address:</label>
          <input type="text" name="doctorAddress" />
          <br />
          <label htmlFor="patientAge">Paciente address:</label>
          <input type="text" name="pacienteAddress" />
          <br />
          <button type="submit">Add Patient</button>
        </form> */}
        <form onSubmit={this.handleAutorizarMedicoSubmit}>
          <button type="submit">AUTORIZAR MEDICO 1</button>
        </form>
        <form onSubmit={this.handleAgregaPacienteSubmit}>
          <button type="submit">AGREGAR PACIENTE 2</button>
        </form>
        <form onSubmit={this.handleAutorizarMedicoPacienteSubmit}>
          <button type="submit">AUTORIZAR PACIENTE MEDICO 3</button>
        </form>
        <form onSubmit={this.handleObtenerInformacionPacienteSubmit}>
          <button type="submit">obtenerInformacionPaciente</button>
        </form>
      </div>

    );
  }
}

export default App;
