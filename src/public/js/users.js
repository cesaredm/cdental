/*window.onload = ()=>{
    mostrarUsers();
};*/
mostrarUsers();

var btn = document.getElementById('btn-guardar-users');
//si es true guardara users si es false actualizara
var accion = true;

//metodo para realizar la peticion fetch para saved o update
function SaveUpdate(direccion){
    var listaUsers = document.getElementById('listaUsers');
    const formulario = document.getElementById('form-save-users');
    const datos = new FormData(formulario);
    fetch(direccion, {
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            id:datos.get('id'),
            usuario:datos.get('usuario'),
            password:datos.get('pass')
        })
    })
    .then(data=>data.text())
    .then(data=>{
        swal({title:data, icon:'success'});
        formulario.reset();
        mostrarUsers();
    });
}
//guardar usuarios
document.getElementById('form-save-users').addEventListener('submit', (e)=>{
    e.preventDefault();
    if(accion){
        SaveUpdate('/saveUsers');
    }else{
        SaveUpdate('/updateUser')
    }
    btn.innerHTML = '<span class="icon-floppy" /> Guardar';
    accion = true;
});
//mostrar usuarios
function mostrarUsers() {
    fetch('/getUsers')
    .then(data=>data.json())
    .then(data=>{
        var template = '';
        data.forEach(usuario=>{
            template += `
            <a href="#" class="list-group-item list-group-item-action" id="${usuario.id}">
                <b>
                    ${usuario.usuario} <span class="icon-right-outline"/>
                </b>
                <button class="btn btn-success btn-sm" btn="editar-user">Editar</button>
                <button class="btn btn-danger btn-sm" btn="borrar-user">Borrar</button>
            </a>
            `;
        });
        listaUsers.innerHTML = template;
    });
};

//borrar o enviar a editar
document.addEventListener('click',(e)=>{
    let elemento = e.target.getAttribute('btn');
    //llenar el formulario para expediente segun la cita 
    if(elemento === 'btn-crear-expediente'){
        //llenar los campos de form expediente con los datos de la cita
        let id = e.target.parentElement.parentElement.parentElement.getAttribute('id');
        
        fetch('/llenarExpediente',{
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST',
            body:JSON.stringify({
                id
            })
        })
        .then(datos=>datos.json())
        .then(datos=>{
                document.getElementById('nombresExpediente').value = datos[0].nombres;
                document.getElementById('apellidosExpediente').value = datos[0].apellidos;
                document.getElementById('telefonoExpediente').value = datos[0].telefono;
        });
    }else if(elemento === 'editar-user'){
        //editar usuarios
        let id = e.target.parentElement.getAttribute('id');
        accion = false;
        fetch('/editarUser',{
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST',
            body:JSON.stringify({
                id
            })
        })
        .then(datos=>datos.json())
        .then(datos=>{
            document.getElementById('idUser').value = datos[0].id;
            document.getElementById('usuario').value = datos[0].usuario;
            document.getElementById('password').value = datos[0].password;
            btn.innerHTML = '<span class="icon-arrows-cw"></span> Actualizar';
        });
    }else if(elemento === 'borrar-user'){
        //borrar usuarios
        let id = e.target.parentElement.getAttribute('id');
        swal({
            title: "Advertencia.",
            text: "Seguro que quiere borrar este usuario.?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                //peticion para borrar
                fetch('borrarUser',{
                    headers:{
                        'Content-Type':'application/json'
                    },
                    method:'POST',
                    body:JSON.stringify({
                        id
                    })
                })
                .then(message=>message.text())
                .then(message=>{
                    mostrarUsers();
                    swal({
                        title:message,
                        icon:'success'
                    });
                });
            }
          });
        
    }
});






