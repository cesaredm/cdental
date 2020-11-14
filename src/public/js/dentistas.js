mostrarDentistas('');

var bandera = true;

//Guardar o Actualizar Dentistas
document.getElementById('form-save-dentista').addEventListener('submit',(e)=>{
    e.preventDefault();
    if(bandera){
        peticionSaveUpdate('/saveDentista');
    }else{
        peticionSaveUpdate('/updateDentista');
    }

    
});
//funcion para hacer peticion de guardado y actualizado de dentistas
function peticionSaveUpdate(direccion) {
    var formulario = document.getElementById('form-save-dentista');
    var datos = new FormData(formulario);
    fetch(direccion,{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            id:datos.get('id'),
            nombreDentista:datos.get('nombreDentista'),
            apellidoDentista:datos.get('apellidoDentista'),
            colorDentista:datos.get('colorDentista')
        })
    })
    .then(message=>message.text()).then(message=>{
        bandera = true;
        formulario.reset();
        mostrarDentistas('');
        document.getElementById('btn-guardar-dentista').innerHTML = `<span class="icon-floppy"></span>Guardar`;
        swal({
            title:message,
            icon:'success'
        });
    });
}
//mostrar dentistas
function mostrarDentistas(dato) {
    fetch('/mostrarDentistas',{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({
            dato
        })
    }).then(datos=>datos.json()).then(datos=>{
        var template = '';
        var options = '';
        var colorTraducido;
        datos.forEach(dentista=>{
            //Traduccion de los colores
            switch (dentista.color) {
                case 'brown':colorTraducido = 'Cafe';break;
                case 'green': colorTraducido = 'Verde';break;
                case 'red': colorTraducido = 'Rojo';break;
                case 'lime': colorTraducido = 'Lima';break;
                case 'blue': colorTraducido = 'Azul';break;
                case 'yellow': colorTraducido = 'Amarillo';break;
                case 'black': colorTraducido = 'Negro';break;
                case 'purple': colorTraducido = 'Purpura';break;
                case 'orange': colorTraducido = 'Naranja';break;
                case 'gray': colorTraducido = 'Gris';break;
                default:
                    break;
            }
            template += `
            <tr id="${dentista.id}">
                <td>${dentista.nombres}</td>
                <td>${dentista.apellidos}</td>
                <td>${colorTraducido}</td>
                <td>
                    <button class="btn btn-danger btn-sm" btn="borrar-dentista"><span class="icon-trash-empty"></span>Borrar</button>
                    <button class="btn btn-info btn-sm" btn="editar-dentista"><span class="icon-edit"></span>Editar</button>
                </td>
            </tr>
            `;
            options += `
            <option value="${dentista.id}">
                Dr. ${dentista.nombres} ${dentista.apellidos}
            </option>
            `;
        });

        document.getElementById('list-dentist').innerHTML = template;
        document.getElementById('dentistaCita').innerHTML = options;
    });
}

//buscar dentista
document.getElementById('buscarDentista').addEventListener('keyup',()=>{
    var dato = document.getElementById('buscarDentista').value;

    mostrarDentistas(dato);
});

document.getElementById('list-dentist').addEventListener('click',(e)=>{
    var btn = e.target.getAttribute('btn');

    //code para enviar peticion de borrado al server
    if(btn == 'borrar-dentista'){
        var id = e.target.parentElement.parentElement.getAttribute('id');
        swal({
            title: "Advertencia.",
            text: "Seguro que quiere borrar este dentista.?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                fetch('/deleteDentista',{
                    headers:{
                        'Content-Type':'application/json'
                    },
                    method:'POST',
                    body:JSON.stringify({
                        id
                    })
                })
                .then(message=>message.text()).then(message=>{
                    mostrarDentistas('');
                    swal({
                        title:message,
                        icon:'success'
                    });
                });
            }
          });
        
    }else if(btn == 'editar-dentista'){
        var id = e.target.parentElement.parentElement.getAttribute('id');
        fetch('/editDentista',{
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST',
            body:JSON.stringify({
                id
            })
        })
        .then(datos=>datos.json()).then(datos=>{
            datos.forEach(dentista=>{
                document.getElementById('idDentista').value = dentista.id;
                document.getElementById('nombreDentista').value = dentista.nombres;
                document.getElementById('apellidoDentista').value = dentista.apellidos;
                document.getElementById('colorDentista').value = dentista.color;
            });
            bandera = false;
            document.getElementById('btn-guardar-dentista').innerHTML = `<span class="icon-arrows-cw"></span>Actualizar`;
        });
    }
});