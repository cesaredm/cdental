window.onload = () => {
    showCitas();
    showCitasDiagnostico();
    resolucion();
};
//inicializar con la hora y fecha
moment().locale();
//inicializacion de socketIO
const socket = io();
//variable para la instacia de calendario
var calendar;
//accion para saber si se va a guardar o editar
var accion = true;
var arrayEvents = [];
var idEvent;


//calendar
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    // nueva instacia de fullCalendar
    calendar = new FullCalendar.Calendar(calendarEl, {
        // vista Inicial del calendario
        initialView: 'dayGridMonth',
        eventColor:'sky',
        eventBackgroundColor:'white',
        eventTextColor:'black',
        eventBorderColor:'sky',
        // ordenamiento de los elementos del encabezado del calendario
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            // right: 'dayGridMonth,timeGridWeek,timeGridDay'
            right: 'dayGridMonth,dayGridWeek,dayGrid,listWeek'
        },
        themeSystem: 'bootstrap',
        editable:false,
        height: 625,
        //texto de los botones del encabezado del calendario
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Dia',
            list: 'Lista',
            dayGrid:'Dia'
        },
        //titulo de los dias staticos al dar scroll
        stickyHeaderDates: true,
        // creacion de botones
        /*customButtons: {
            miBoton: {
                text: 'Boton',
                click: () => {
                    alert('hola cesar');
                }
            }
        },*/
        // obtener la informacion del dia clicked en el calendario
        dateClick: function (info) {
            $('#ingresoCitas').modal();
            document.getElementById('fecha').value = info.dateStr;
        },
        // obtener la informacion del evento clicked en el calendario
        eventClick: (info) => {
            const id = info.event.id;
            document.getElementById('infoCita').innerHTML = `
                <div class="card-header">
                    <h5 class="card-title text-center">
                    ${info.event.extendedProps.nombres} ${info.event.extendedProps.apellidos}.</h5>
                </div>
                <div class="card-body" id="${info.event.id}">
                    <p class="card-text text-wrap">
                    <b>Hora: </b>
                    <div class="border rounded p-2"> 
                        ${moment(info.event.start).format('hh:mm:ss a')} - ${moment(info.event.end).format('hh:mm:ss a')}
                    </div> 
                    <b>Anotaciones: </b> 
                    <div class="border rounded p-2">
                        ${info.event.extendedProps.text}
                    </div>
                    <b>Teléfono: </b> 
                    <div class="border rounded p-2">
                        ${info.event.extendedProps.telefono}
                    </div>
                    <b>Correo electrónico:</b>
                    <div class="border rounded p-2">
                        ${info.event.extendedProps.correo}
                    </div>
                    <b>Dr: </b> 
                    <div class="border rounded p-2">
                        ${info.event.extendedProps.dentista}
                    </div>
                    <div class="text-right mt-2">
                        <button class="btn btn-danger btn-sm mx-auto" btn="btn-delete-cita"><span class="icon-trash-empty"></span> Borrar</button>
                        <button class="btn btn-info btn-sm mx-auto" btn="btn-edit-cita"><span class="icon-edit"></span> Editar</button>
                    </div>
                    </p>               
                </div>
            `;
            $('#modal-info-cita').modal();
        },
        eventDrop:(info)=>{
            console.log(info)
        },
        // agregar eventos
        events: [],
        eventTimeFormat: { // formato del tiempo
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false,
            hour12:true
        }
    });
    //localidad, lenguage
    calendar.setOption('locale', 'Es');
    //response
    calendar.updateSize()
    //mostrar calendario
    calendar.render();
});

// recolectar datos de la cita y guardarla en la base de datos
function datosCitas() {
    var formulario = document.getElementById('form-save-cita');
    var datos = new FormData(formulario);
    var newCita = {
        id:datos.get('id'),
        nombres: datos.get('nombres'),
        apellidos: datos.get('apellidos'),
        telefono: datos.get('telefono'),
        fecha: datos.get('fecha'),
        horaInicio: datos.get('horaInicio'),
        horaFinal: datos.get('horaFinal'),
        dentista: datos.get('dentista'),
        correo: datos.get('correo'),
        anotaciones: datos.get('anotaciones'),
        estado:'pendiente'
    };
    //si accion es true guardara si no Actualizara
    if (accion) { // socket emitiendo los datos de la cita para ser guardados
        socket.emit('datos:cita', newCita);
        formulario.reset();
        swal({title: 'Cita guardada exitosamente.', icon: 'success'})
    } else {
        socket.emit('cita:update', newCita);
        formulario.reset();
        $('#ingresoCitas').modal('toggle');
        swal({title: 'Cita actualizada exitosamente.', icon: 'success'})
    }
}
//escuchando las actualizaciones
socket.on('cita:update',(datos)=>{
        var template = '';
        //obtengo el id de el evento del objeto datos
        var id = datos.datos.id;
        //obtengo el evento segun el id
        var event = calendar.getEventById(id);
        //establezco los valores al evento
        event.setProp('title',datos.datos.nombres + " " +datos.datos.apellidos + " ->" + datos.datos.anotaciones +" : "+"Dr. "+ datos.doctorCita[0].nombres+" "+datos.doctorCita[0].apellidos);
        event.setStart(datos.datos.fecha + " " + datos.datos.horaInicio);
        event.setEnd(datos.datos.fecha + " " + datos.datos.horaFinal);
        event.setExtendedProp('telefono',datos.datos.telefono);
        event.setExtendedProp('text',datos.datos.anotaciones);
        event.setExtendedProp('nombres',datos.datos.nombres);
        event.setExtendedProp('apellidos',datos.datos.apellidos);
        event.setExtendedProp('correo',datos.datos.correo);
        event.setExtendedProp('dentista',datos.doctorCita[0].nombres +" "+datos.doctorCita[0].apellidos);
        event.setProp('color',datos.doctorCita[0].color);
        showCitasDiagnostico();
})

// socket escuchando cuando se guarde una cita para mostrarla en tiempo real
socket.on('cita:guardada', (citas) => {
    var object;
    citas.citas.forEach(cita => {
        object = {
            title: cita.nombres + " " + cita.apellidos + " ->" + cita.anotaciones +" : "+ "Dr. "+ cita.nombresDentista +" "+ cita.apellidosDentista,
            text: cita.anotaciones,
            start: `${cita.fecha} ${cita.horaInicio}`,
            end: cita.fecha + " " + cita.horaFinal,
            id: cita.id,
            nombres: cita.nombres,
            apellidos: cita.apellidos,
            telefono: cita.telefono,
            correo: cita.correo,
            dentista:cita.nombresDentista +" "+ cita.apellidosDentista,
            color: cita.color
        }
        calendar.addEvent(object);
    });
    showCitasDiagnostico();
});
//actualizar vista de eventos al borrar una cita
socket.on('delete:cita',(datos)=>{
    var event = calendar.getEventById(datos.id);
    event.remove();
    showCitasDiagnostico();
});

//socket escuchando cambio de estado
socket.on('update:estado',(message)=>{
    showCitasDiagnostico();
});


// guardar o actualizar citas
document.querySelector('#form-save-cita').addEventListener('submit', (e) => {
    e.preventDefault();
    datosCitas();
    accion = true;
    document.getElementById('btn-guardar-cita').innerHTML = '<span class="icon-floppy"></span>Guardar';
})

// mostrar las citas al entrar al sistema
function showCitas() {
    fetch('/showCitas').then(citas => citas.json()).then(citas => {
        var object;
        citas.forEach(cita => {
            object = {
                title: cita.nombres + " " + cita.apellidos + " -> " + cita.anotaciones +" : "+ "Dr. "+ cita.nombresDentista +" "+ cita.apellidosDentista,
                text: cita.anotaciones,
                start: `${cita.fecha} ${cita.horaInicio}`,
                end: cita.fecha + " " + cita.horaFinal,
                id: cita.id,
                nombres: cita.nombres,
                apellidos: cita.apellidos,
                telefono: cita.telefono,
                dentista: cita.nombresDentista +" "+ cita.apellidosDentista,
                correo: cita.correo,
                color: cita.color,
                allDay:false
            }
            calendar.addEvent(object);
        });
    });
}

// funcion para mostrar citas en diagnostico
function showCitasDiagnostico() {
    fecha = moment().format('YYYY-MM-DD');
    fecha1 = moment().format('YYYY-MM-DD, h:mm:ss a');
    console.log(fecha1);
    fetch('/showCitasDiagnostico',{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({fecha})
    }).then(citas => citas.json()).then(citas => {
        var template = '';
        citas.forEach(cita => {
            //funcion de crear expediente en users.js
            template += `
            <div class="col-10 col-md-4 col-lg-3 mt-4 mx-auto mx-md-0">
                <div class="card card-cita-expediente" id="${cita.id}">
                    <div class="card-header bg-dark">
                        <h6 class="text-center text-white">${cita.nombres} ${cita.apellidos}</h6>
                    </div>
                    <div class="card-body">
                        <div class="card-title text-center">
                            <b>Hora.</b> ${cita.horaInicio} - ${cita.horaFinal}
                        </div>
                        <div class="card-text text-center">
                            ${cita.anotaciones}
                        </div>
                        <p class="text-center font-weight-bold small">${cita.telefono}</p>
                        <p class="text-center font-weight-bold small">
                            Dr. ${cita.nombresDentista} ${cita.apellidosDentista}
                        </p>
                        <div class="text-center">
                            <a href="#" class="card-link text-primary" data-toggle="modal" data-target="#ingresoExpediente" btn="btn-crear-expediente">Crear expediente</a>
                            <a href="#" class="card-link text-danger" btn="btn-update-estado">Terminado</a>  
                        </div>
                    </div>
                </div>
            </div>`;
        })
        console.log(template);
        document.getElementById('list-citas-diagnostico').innerHTML = template;
    });

}
// accion para editar,actualizar o borrar
document.addEventListener('click', (e) => {
    var btn = e.target.getAttribute('btn');

    if (btn === 'btn-delete-cita') {
        var id = e.target.parentElement.parentElement.getAttribute('id');
        //alert de confirmacion
        swal({
            title: "Advertencia.",
            text: "Seguro que quiere borrar esta cita.?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                //peticion para borrar
                socket.emit('delete:cita',{
                    id
                });
                swal({
                    title:'Cita eliminada exitosamente',
                    icon:'success'
                });
                $('#modal-info-cita').modal('toggle');
            }
          });
    } else if (btn === 'btn-edit-cita') {
        var id = e.target.parentElement.parentElement.getAttribute('id');
        fetch('/editCita', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({id})
        }).then(cita => cita.json()).then(cita => {
            document.getElementById('idCita').value = cita[0].id;
            document.getElementById('nombres').value = cita[0].nombres;
            document.getElementById('apellidos').value = cita[0].apellidos;
            document.getElementById('telefono').value = cita[0].telefono;
            document.getElementById('fecha').value = cita[0].fecha;
            document.getElementById('horaInicio').value = cita[0].horaInicio;
            document.getElementById('horaFinal').value = cita[0].horaFinal;
            document.getElementById('dentistaCita').value = cita[0].dentista;
            document.getElementById('correoCita').value = cita[0].correo;
            document.getElementById('anotaciones').value = cita[0].anotaciones;
            accion = false;
            document.getElementById('btn-guardar-cita').innerHTML = '<span class="icon-arrows-cw"></span>Actualizar';
            $('#modal-info-cita').modal('toggle');
            $('#ingresoCitas').modal();
        });
    }
});

//BORRAR CITAS DIAGNOSTICO
document.getElementById('list-citas-diagnostico').addEventListener('click',(e)=>{
    let btn = e.target.getAttribute('btn');
    if(btn === 'btn-update-estado'){
        let id = e.target.parentElement.parentElement.parentElement.getAttribute('id');
        socket.emit('update:estado',{
            id
        });
    }
});

function resolucion() {
    var ancho = screen.width;
    var alto = screen.height;

    if(ancho === 425){
        calendar.setOption('height', 400);
    }
}
