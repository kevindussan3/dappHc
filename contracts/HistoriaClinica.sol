// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HistoriaClinica {
    address public creador;
    mapping(address => Paciente) private pacientes;
    mapping(address => Medico) private medicos;
    
    struct Paciente {
        string nombre;
        uint256 edad;
        string diagnostico;
        address medico;
        bool autorizado;
    }
    struct Medico {
        string nombre;
        string especialidad;
        address medico;
        bool autorizado;
    }

    event PacienteAgregado(
        address indexed paciente,
        string nombre,
        uint256 edad,
        string diagnostico,
        address medico
    );

    constructor() {
        creador = msg.sender;
    }

    modifier soloMedicosAutorizados() {
        require(
            medicos[msg.sender].autorizado,
            // medicos[msg.sender].autorizado,
            "Solo los medicos autorizados pueden acceder a esta informacion."
        );
        _;
    }
    modifier soloCreador() {
        require(
            msg.sender == creador,
            "Solo el creador del contrato puede realizar esta accion."
        );
        _;
    }

    function agregarPaciente(
        address _paciente,
        string memory _nombre,
        uint256 _edad,
        string memory _diagnostico
    ) public {
        require(
            medicos[_paciente].medico == address(0),
            "El paciente ya esta registrado en la historia clinica."
        );

        Paciente storage nuevoPaciente = pacientes[_paciente];
        nuevoPaciente.nombre = _nombre;
        nuevoPaciente.edad = _edad;
        nuevoPaciente.diagnostico = _diagnostico;
        nuevoPaciente.medico = msg.sender;
        nuevoPaciente.autorizado = true;

        emit PacienteAgregado(
            _paciente,
            _nombre,
            _edad,
            _diagnostico,
            msg.sender
        );
    }

    function obtenerInformacionPaciente(
        address _paciente
    )
        public
        view
        soloMedicosAutorizados
        returns (string memory, uint256, string memory)
    {
        Paciente memory paciente = pacientes[_paciente];
        require(
            paciente.medico != address(0),
            "El paciente no esta registrado en la historia clinica."
        );
        return (paciente.nombre, paciente.edad, paciente.diagnostico);
    }

    function actualizarDiagnostico(
        address _paciente,
        string memory _diagnostico
    ) public soloMedicosAutorizados {
        Paciente storage paciente = pacientes[_paciente];
        require(
            paciente.medico == msg.sender,
            "Solo el medico tratante puede actualizar el diagnostico."
        );
        paciente.diagnostico = _diagnostico;
    }

    function isDoctor(address _medico) public view returns (bool) {
        return medicos[_medico].autorizado;
    }

    function autorizarMedico(
        address _medico,
        address _paciente
    ) public soloMedicosAutorizados {
        Medico storage medico = medicos[msg.sender];
        require(
            medico.autorizado == true,
            "Solo los medicos autorizados pueden autorizar a otros."
        );
        Paciente storage paciente = pacientes[_paciente];
        require(
            paciente.medico == msg.sender,
            "Solo el medico tratante puede autorizar a otros medicos."
        );
        Medico storage medicoAutorizado = medicos[_medico];
        require(
            medicoAutorizado.medico != address(0),
            "El medico no esta registrado en la historia clinica."
        );
        medicoAutorizado.autorizado = true;
    }

    function revocarAutorizacionMedico(
        address _medico,
        address _paciente
    ) public soloMedicosAutorizados {
        Paciente storage paciente = pacientes[_paciente];
        require(
            paciente.medico == msg.sender,
            "Solo el medico tratante puede revocar la autorizacion."
        );
        require(
            paciente.medico != _medico,
            "El medico tratante no puede revocar su propia autorizacion."
        );
        paciente.autorizado = false;
    }

    event MedicoAgregado(
        address indexed medico,
        string nombre,
        string especialidad,
        bool autorizado,
        address indexed quienAgrega
    );

    function agregarMedico(
        address _medico,
        string memory _nombre,
        string memory _especialidad,
        bool _autorizar
    ) public soloCreador {
        require(
            medicos[_medico].medico == address(0),
            "El medico ya esta registrado en la historia clinica."
        );

        Medico storage nuevoMedico = medicos[_medico];
        nuevoMedico.nombre = _nombre;
        nuevoMedico.especialidad = _especialidad;
        nuevoMedico.medico = _medico;
        nuevoMedico.autorizado = _autorizar;

        emit MedicoAgregado(
            _medico,
            _nombre,
            _especialidad,
            _autorizar,
            msg.sender
        );
    }
}
