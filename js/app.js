let DB;
// Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

window.onload = function() {
    eventListeners();

    crearDB();

    
}

//Clases
class Citas{
    constructor() {
        this.citas = [];
    }    
    agregarCita(cita) {
        this.citas = [...this.citas, cita];

        console.log(this.citas);
    }

    eliminarCita(id) {
        this.citas = this.citas.filter( cita => cita.id != id)
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
    
}

class UI{
    imprimirAlerta(mensaje, tipo) {
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        // agregar clase en base al tipo de error
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
             divMensaje.classList.add('alert-success')
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        // Agregar al Dom
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //quitar alerta desp de 5s
        setTimeout(() => {
            divMensaje.remove();
        }, 5000);
    }

    imprimirCitas() {

        this.limpiarHtml();

        //leer el contenido de la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');

        objectStore.openCursor().onsuccess = function(e) {
            const cursor = e.target.result;

            if (cursor) {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value;
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // Scripting de los elementos de la cita
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `;
            
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
            `;
            
            //Boton para eliminar citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

            btnEliminar.onclick = () => eliminarCita(id);

            //añade un boton para editar las citas
                const btnEditar = document.createElement('button');
                const cita = cursor.value;
            btnEditar.classList.add('btn', 'btn-info')
            btnEditar.innerHTML = 'Editar <svg class="w - 6 h - 6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>';
            btnEditar.onclick = () => cargarEdicion(cita);
            
            //agregar parrafos a divCita
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //agregar citas al html
            contenedorCitas.appendChild(divCita);
            
            //VE AL SIGUIENTE ELEMENTO
            cursor.continue();
            }
        }

        // citas.forEach(cita => {
            
        // })
    }

    limpiarHtml() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

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
       

        // pasar el objeto de la cita a edicion
        administrarCitas.editarCita({ ...citaObj });

        //Edita en Indexdb
        const transaction = DB.transaction(['citas'], 'readwrite');
        const objectStore = transaction.objectStore('citas');

        objectStore.put(citaObj);

        transaction.oncomplete = () => {
            ui.imprimirAlerta('Editado correctamente');
              
            //regresar el texto del boton a su estado original
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

            //quitar modo edicion
            editando = false;
        }

        transaction.onerror = () => {
            
        }

    } else {
        //generar un id unico
        citaObj.id = Date.now();

        //crear una nueva cita
        administrarCitas.agregarCita({ ...citaObj });

        // insertar registro en indexedDB
        const transaction = DB.transaction(['citas'], 'readwrite');

        // habilitar el objecStore
        const objectStore = transaction.objectStore('citas');

        // Insertar en el DB
        objectStore.add(citaObj);

        transaction.oncomplete = function() {
            console.log('cita agregada');

            // msj de agregado correctamente
            ui.imprimirAlerta('Se agregó correctamente');
        }

     

    }
    

    //reiniciar el obj para la validacion
    reiniciarObj();
    //reiniciar formulario
    formulario.reset();

    // mostrar html de las citas
    ui.imprimirCitas();
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
    ui.imprimirCitas();
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

function crearDB() {
    //crear la base de datis eb version 1.0
    const crearDB = window.indexedDB.open('citas', 1);

    //si hay error
    crearDB.onerror = function () {
        console.log('error')
    }

    // todo sale bien
    crearDB.onsuccess = function () {
        console.log('bd creada');

        DB = crearDB.result;

        console.log(DB);

        //mostrar citas al cargar (indexDB esta listo)
        ui.imprimirCitas();
    }

    //Definir el schema
    crearDB.onupgradeneeded = function (e) {
        const db = e.target.result;

        const objectStore = db.createObjectStore('citas', {
            keyPath: 'id',
            autoIncremet: true
        });

        //definir todas las columnas 
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('propietario', 'propietario', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });
        objectStore.createIndex('id', 'id', { unique: true });
    
        console.log('DB creada')
    }
}