let editando;

const ui = new UI();
const administrarCitas = new Citas();

// Registar eventos
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCitas);
    propietarioInput.addEventListener('input', datosCitas);
    telefonoInput.addEventListener('input', datosCitas);
    fechaInput.addEventListener('input', datosCitas);
    horaInput.addEventListener('input', datosCitas);
    sintomasInput.addEventListener('input', datosCitas);

    formulario.addEventListener('submit', nuevaCita);

}


//Objeto con la info de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

// Agrega daos al objeto de cita
function datosCitas(e) {
    citaObj[e.target.name] = e.target.value;
}

// Valida y agrega una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    // Extraer info del objeto de cita
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    // Validad
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

        return;
    }

    if (editando) {
        ui.imprimirAlerta('Editado correctamente');

        // pasar el objeto de la cita a edicion
        administrarCitas.editarCita({ ...citaObj });

        //regresar el texto del boton a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        //quitar modo edicion
        editando = false;

    } else {
        //generar un id unico
        citaObj.id = Date.now();

        //crear una nueva cita
        administrarCitas.agregarCita({ ...citaObj });

        // msj de agregado correctamente
        ui.imprimirAlerta('Se agregó correctamente');

    }
    

    //reiniciar el obj para la validacion
    reiniciarObj();
    //reiniciar formulario
    formulario.reset();

    // mostrar html de las citas
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObj() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    //elimnar la cita
    administrarCitas.eliminarCita(id);
    //muestre msj
    ui.imprimirAlerta('La cita ha sido eliminada');
    //refrescar citas
    ui.imprimirCitas(administrarCitas);
}

//cargar los datos y el modo edicion
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //llenar los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //cambiar texto de boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;
}