//arreglo global de la citas a enviar notificacion
var arregloCitas = [];
document.getElementById('mostrar-notificaciones').addEventListener('click',()=>{
    var card = document.getElementById('citasTomorrow');
    var d = new Date();
    var fecha = sumarDias(d, +1);
    var fechaTomorrow = moment(fecha).format("YYYY-MM-DD");
    fetch('/citasTomorrow',{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({fechaTomorrow})
    }).then(citas=>citas.json()).then(citas=>{
        var template = '';
        if(citas.length>0){
            citas.forEach(cita => {
                template += `
                            <div class="p-3 font-weight-bold mb-2 border citasNotificacion">
                                ${cita.nombres} ${cita.apellidos}
                            </div>`;
            arregloCitas.push(cita.telefono);
            });
            card.innerHTML = template;
        }else{
            card.innerHTML = 'No hay citas pendientes para mañana...';
        }
    });
})

document.getElementById('enviarNotificacion').addEventListener('submit',(e)=>{
    e.preventDefault();
    var mensaje = document.getElementById('mensaje').value;
    var remitente = document.getElementById('remitente').value;
    var d = new Date();
    var fecha = sumarDias(d, +1);
    var fechaTomorrow = moment(fecha).format("YYYY-MM-DD");

    fetch('/enviarNotificacion',{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({mensaje,remitente,fechaTomorrow})
    }).then(message=>message.text()).then(message=>{
        swal({
            title:message,
            icon:'success'
        });
        document.getElementById('enviarNotificacion').reset();
    });
})

//funcion para sacar la fecha de manana
function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }