/*$(document).ready(function(){
    showExpedientes();
});*/

var accion = true;

//guardar o actualizar expediente
document.getElementById('form-save-expediente').addEventListener('submit',(e)=>{
    e.preventDefault();
    var b;
    var formulario = document.getElementById('form-save-expediente');
    var datos = new FormData(formulario);
    if(accion){
        fetch('/saveExpediente',{
            headers: {
                'Content-Type': 'application/json'
            },
            method:'POST',
            body:JSON.stringify({
                nombres:datos.get('nombres'),
                apellidos:datos.get('apellidos'),
                telefono:datos.get('telefono'),
                sexo:datos.get('sexo'),
                edad:datos.get('edad'),
                nacionalidad:datos.get('nacionalidad'),
                fecha:datos.get('fecha'),
                anotaciones:datos.get('anotaciones')
            })
        })
        .then(expedientes=>expedientes.text())
        .then(expedientes=>{
            formulario.reset();
            swal({
                title:expedientes,
                icon:'success'
            });
            //showExpedientes()
        });
    }else{
        fetch('/updateExpediente',{
            headers: {
                'Content-Type': 'application/json'
            },
            method:'POST',
            body:JSON.stringify({
                id:datos.get('id'),
                nombres:datos.get('nombres'),
                apellidos:datos.get('apellidos'),
                telefono:datos.get('telefono'),
                sexo:datos.get('sexo'),
                edad:datos.get('edad'),
                nacionalidad:datos.get('nacionalidad'),
                fecha:datos.get('fecha'),
                anotaciones:datos.get('anotaciones')
            })
        })
        .then(expedientes=>expedientes.text())
        .then(expedientes=>{
            formulario.reset();
            swal({
                title:expedientes,
                icon:'success'
            });
            //showExpedientes();
            accion = true;
            document.getElementById('btn-guardar-expediente').innerHTML = '<span class="icon-floppy"></span> Guardar';
            b = document.getElementById('buscarExp').value;
            buscarExp(b);
        });
    }
    
})

//mostrar expedientes
function showExpedientes() {
    fetch('/expedientes')
    .then(expedientes=>expedientes.json())
    .then(expedientes=>{
        var template = '';

        expedientes.forEach(expediente=>{
            template += `
                <a href="#" class="list-group-item list-group-item-action font-weight-bold" id="${expediente.id}" accion="exp">
                    ${expediente.nombres} ${expediente.apellidos}<span class="icon-right-outline"/> ${expediente.edad} años
                <a>
            `;
        });
        document.getElementById('listaExpedientes').innerHTML = template;
    });
}

//buscarExpediente
document.getElementById('buscarExp').addEventListener('keyup', ()=>{
    var dato = document.getElementById('buscarExp').value;
    //buscar solo si el input tiene contenido
    if(dato != ""){
        buscarExp(dato);
    }else{
        document.getElementById('listaExpedientes').innerHTML = '';
    }
})

document.getElementById('buscarExpModal').addEventListener('keyup',()=>{
    var dato = document.getElementById('buscarExpModal').value;
    //buscar solo si el input tiene contenido
    if(dato != ""){
        buscarExp(dato);
    }else{
        document.getElementById('listaExpedientesModal').innerHTML = '';
    }
});


//borrar y editar
document.getElementById('infoExpediente').addEventListener('click',(e)=>{
    var btn = e.target.getAttribute('btn');
    var id;
    var dato = document.getElementById('buscarExp');
    if(btn==='btn-editar-expediente'){
        accion = false;
        id = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
        fetch('/editExpediente',{
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST',
            body:JSON.stringify({id})
        }).then(datos=>datos.json()).then(datos=>{
            document.getElementById('idExpediente').value = datos[0].id;
            document.getElementById('nombresExpediente').value = datos[0].nombres;
            document.getElementById('apellidosExpediente').value = datos[0].apellidos;
            document.getElementById('telefonoExpediente').value = datos[0].telefono;
            document.getElementById('sexoExpediente').value = datos[0].sexo;
            document.getElementById('edadExpediente').value = datos[0].edad;
            document.getElementById('nacionalidadExpediente').value = datos[0].nacionalidad;
            document.getElementById('fechaExpediente').value = moment(datos[0].fecha).format('YYYY-MM-DD');
            document.getElementById('anotacionesExpediente').value = datos[0].anotaciones;

            document.getElementById('btn-guardar-expediente').innerHTML = '<span class="icon-arrows-cw"></span> Actualizar';
            $('#modal-info-expediente').modal('toggle');
            $('#ingresoExpediente').modal();
        });
    }else if(btn==='btn-borrar-expediente'){
        id = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
        swal({
            title: "Advertencia.",
            text: "Seguro que quiere borrar este expediente.?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                //peticion para borrar
                fetch('/deleteExpediente',{
                    headers:{
                        'Content-Type':'application/json'
                    },
                    method:'POST',
                    body:JSON.stringify({id})
                }).then(message=>message.text()).then(message=>{
                    //showExpedientes();
                    buscarExp(dato);
                    $('#modal-info-expediente').modal('toggle');
                    swal({title:message,
                          icon:'success'
                        });
                });
            }
        });  
    }
})

function buscarExp(dato) {
    fetch('/buscarExp',{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            dato
        })
    })
    .then(exps=>exps.json())
    .then(exps=>{
        var template = '';

        exps.forEach(expediente=>{
            template += `
                <a href="#" class="list-group-item list-group-item-action font-weight-bold" id="${expediente.id}" accion="exp">
                    ${expediente.nombres} ${expediente.apellidos}<span class="icon-right-outline"/> ${expediente.edad} años
                </a>
            `;
        });
        document.getElementById('listaExpedientes').innerHTML = template;
        document.getElementById('listaExpedientesModal').innerHTML = template;
    })
    .catch(error=>{
        console.log(error)
    });
}