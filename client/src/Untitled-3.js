import React from "react";
import getWeb3 from "../helpers/getWeb3";
import historiaClinicaContract from "../contracts/HistoriaClinica.json";

class App extends React.Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    pacienteNombre: "",
    pacienteEdad: 0,
    pacienteGenero: "",
    isDoctor: false,
    doctorDireccion: "",
    doctorNombre: "",
  };


  componentDidMount = async () => {
    try {
      // Obtener la instancia de web3 y del contrato
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = historiaClinicaContract.networks[networkId];
      const contract = new web3.eth.Contract(
        historiaClinicaContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Setear el estado de la aplicación
      this.setState({ web3, accounts, contract });

      // Verificar si el usuario es doctor
      const isDoctor = await contract.methods.esDoctor(accounts[0]).call();
      this.setState({ isDoctor });

      if (isDoctor) {
        // Obtener la dirección y el nombre del doctor
        const doctorDireccion = accounts[0];
        const doctorNombre = await contract.methods.getDoctorNombre(doctorDireccion).call();
        this.setState({ doctorDireccion, doctorNombre });
      } else {
        // Obtener el nombre del paciente
        const pacienteDireccion = accounts[0];
        const pacienteNombre = await contract.methods.getPacienteNombre(pacienteDireccion).call();
        const pacienteEdad = await contract.methods.getPacienteEdad(pacienteDireccion).call();
        const pacienteGenero = await contract.methods.getPacienteGenero(pacienteDireccion).call();
        this.setState({ pacienteNombre, pacienteEdad, pacienteGenero });
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { isDoctor, doctorDireccion, doctorNombre, pacienteNombre, pacienteEdad, pacienteGenero } = this.state;

    if (!this.state.web3) {
      return <div>Loading Web3...</div>;
    }

    return (
      <div>
        {isDoctor ? (
          <div>
            <h1>Bienvenido, Dr. {doctorNombre}</h1>
            <p>Dirección: {doctorDireccion}</p>
          </div>
        ) : (
          <div>
            <h1>Bienvenido, {pacienteNombre}</h1>
            <p>Edad: {pacienteEdad}</p>
            <p>Género: {pacienteGenero}</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;