
var expediente = '';
var idExpedienteInfo = '';
var diente = '';
var procesoDiente = '';
var nombreProceso = '';

$('#infoProcessExpediente').hide();



//quitar acentos o tildes a cadenas de texto
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
} 

//LIMPIAR SUPERFICIES y raices
function limpiarSuperficies() {
    var superficies5 = [18,17,16,15,14,24,25,26,27,28,44,45,46,47,48,34,35,36,37,38,54,55,64,65,74,75,84,85];
    var superficies4 = [11,12,13,21,22,23,41,42,43,31,32,33,51,52,53,61,62,63,71,72,73,81,82,83];
    var clase;
    //limpiar las superficies de las molares y premolares
    //recorrer los dientes
    superficies5.forEach(e=>{
        //recorrer las superficies de los dientes de 5 superficies
        for (let index = 1; index < 6; index++){
            clase = document.getElementById(`s${index}de5-${e}`);
            switch (clase.getAttribute('class')) {
                case `s${index}de5Color`:{
                    clase.removeAttribute('class',`s${index}de5Color`);
                    clase.setAttribute('class',`s${index}de5`);
                }break;
                case `s${index}de5Blanquiamientos`:{
                    clase.removeAttribute('class',`s${index}de5Blanquiamientos`);
                    clase.setAttribute('class',`s${index}de5`);
                }break;
                case `s${index}de5Carilla`:{
                    clase.removeAttribute('class',`s${index}de5Carilla`);
                    clase.setAttribute('class',`s${index}de5`);
                }break;
                case `s${index}de5Corona`:{
                    clase.removeAttribute('class',`s${index}de5Corona`);
                    clase.setAttribute('class',`s${index}de5`);
                }break;
                default:
                    break;
            }
        }
        document.getElementById(`diente${e}`).innerHTML = '';
    });
    //limpiar las superficies de las molares y premolares
    //recorrer los dientes
    superficies4.forEach(e=>{
        //recorrer las superficies de los dientes de 4 superficies
        for (let index = 1; index < 5; index++){
            clase = document.getElementById(`s${index}de4-${e}`);
            switch (clase.getAttribute('class')) {
                case `s${index}de4Color`:{
                    clase.removeAttribute('class',`s${index}de4Color`);
                    clase.setAttribute('class',`s${index}de4`);
                }break;
                case `s${index}de4Blanquiamientos`:{
                    clase.removeAttribute('class',`s${index}de4Blanquiamientos`);
                    clase.setAttribute('class',`s${index}de4`);
                }break;
                case `s${index}de4Corona`:{
                    clase.removeAttribute('class',`s${index}de4Corona`);
                    clase.setAttribute('class',`s${index}de4`);
                }break;
                case `s${index}de4Carilla`:{
                    clase.removeAttribute('class',`s${index}de4Carilla`);
                    clase.setAttribute('class',`s${index}de4`);
                }break;
                default:
                    break;
            }
        }
        document.getElementById(`diente${e}`).innerHTML = '';
        document.getElementById('titulo-dentadura').innerHTML = '';
    });
}

// MOSTRAR INFORMACION DE EXPEDIENTE
document.addEventListener('click', (e) => {
    var accion = e.target.getAttribute('accion');
    if (accion == 'exp') {
        idExpedienteInfo = e.target.getAttribute('id');
        fetch('/infoExpediente', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({idExpedienteInfo})
        }).then(info => info.json()).then(info => {
            var template = `
            <div class="card-body" id="${info[0].id}" nombre="${info[0].nombres}" apellido="${info[0].apellidos}">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <!-- nombres -->
                        <div>
                            <span class="font-weight-bold">Nombres:</span>
                            <p class="p-2 border">${
                    info[0].nombres
                }</p>
                        </div>
                        <!-- apellidos -->
                        <div>
                            <span class="font-weight-bold">Apellidos:</span>
                            <p class="p-2 border">${
                    info[0].apellidos
                }</p>
                        </div>
                        <!-- telefono -->
                        <div>
                            <span class="font-weight-bold">
                                Telefono:</span>
                            <p class="p-2 border">${
                    info[0].telefono
                }</p>
                        </div>
                        <!-- sexo -->
                        <div>
                            <span class="font-weight-bold">
                                Sexo:</span>
                            <p class="p-2 border">${
                    info[0].sexo
                }</p>
                        </div>
                    </div>
                    <div
                        class="col-12 col-md-6">
                        <!-- edad -->
                        <div>
                            <span class="font-weight-bold">
                                Edad:</span>
                            <p class="p-2 border">${
                    info[0].edad
                }</p>
                        </div>
                        <!-- Nacionalidad -->
                        <div>
                            <span class="font-weight-bold">
                                Nacionalidad:</span>
                            <p class="p-2 border">${info[0].nacionalidad}</p>
                        </div>
                        <!-- Fecha -->
                        <div>
                            <span class="font-weight-bold">
                                Fecha de Creacion:</span>
                            <p class="p-2 border">${moment(info[0].fecha).format('DD-MMM-YYYY')}</p>
                        </div>
                        <!-- anotaciones -->
                        <div>
                            <span class="font-weight-bold">
                                Anotaciones:</span>
                            <p class="p-2 border">${info[0].anotaciones}</p>
                        </div>
                    </div>
                </div>
            <div class="row">
                <div class="col-12">
                    <!-- div para los botones -->
                    <div class="text-right">
                        <button class="btn btn-primary btn-sm" btn="btn-addDiagnostico">Add Diagnostico</button>
                        <button class="btn btn-info btn-sm" btn="btn-editar-expediente">Editar</button>
                        <button class="btn btn-danger btn-sm" btn="btn-borrar-expediente">Borrar</button>
                    </div>
                </div>
            </div>
        </div>
                `;
            document.getElementById('infoExpediente').innerHTML = template;
            $('#infoProcessExpediente').show();
            //$('#modal-info-expediente').modal();
        });

    }
})

// click para addDiagnostico al expediente
document.addEventListener('click', (e) => {
    var btn = e.target.getAttribute('btn');
    var elemento; 
    if (btn === 'btn-addDiagnostico') {
        limpiarSuperficies();
        expediente = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('id');
        var nombres = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('nombre');
        var apellidos = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('apellido');
        $('.diente span').text('');
        mostrarGraficosOdontograma(expediente);
        mostrarRestauraciones(expediente);
        $('#modal-info-expediente').modal('toggle');
        document.getElementById('titulo-dentadura').innerHTML = `${nombres} ${apellidos}`;
        $('#infoProcessExpediente').show();
        mostrarHistorialMedico();
    }
});

// click al diente para agregar el id de diente a la variable diente (cuerpo de la card de la dentadura)
document.getElementById('cardDientes').addEventListener('click', (e) => {
    var btn = e.target.getAttribute('diente');
    if(btn==='raiz'){
        diente = e.target.getAttribute('id');
    }else if(btn==='superficie'){
        diente = e.target.getAttribute('nDiente');
    }
});

//mostrar historial medico
document.getElementById('infoMedica-tab').addEventListener('click',()=>{
    mostrarHistorialMedico();
});
/*--------------------- GUARDAR PROCESOS DE RAIZ ---------------------------------*/
//GUARDAR EXTRACCIONES
document.getElementById('guardar-extracciones').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso').value;
    var extraccionQ = document.getElementById('extraccion-convencional');
    var extraccionC = document.getElementById('extraccion-quirurgica');
    var otros = document.getElementById('otras-extracciones');
    var anotaciones = document.getElementById('extraccion-anotaciones').value;
    var procesos = [extraccionQ,extraccionC,otros];
    guardarProceso(procesoPadre,procesos,diente,anotaciones);
});

//GUARDAR RESTAURACIONES
document.getElementById('guardar-restauraciones').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('restauracion').value;
    var posteNucleo = document.getElementById('poste-nucleo');
    var procesos = [posteNucleo];
    guardarProceso(procesoPadre,procesos,diente,'');
});

//GUARDAR CORONAS
document.getElementById('guardar-coronas').addEventListener('submit',(e)=>{
    e.preventDefault();
    var coronaMetal = document.getElementById('corona-metal');
    var coronaProvisional = document.getElementById('corona-provisional');
    var zm = document.getElementById('corona-monolitico');
    var ze = document.getElementById('corona-estratificado');
    var emaxm = document.getElementById('corona-emax-monolitico');
    var emaxe = document.getElementById('corona-emax-estratificado');
    var procesoPadre = document.getElementById('corona').value;
    var procesos = [coronaMetal,coronaProvisional,zm,ze,emaxm,emaxe];
    guardarProceso(procesoPadre,procesos,diente,'');
});

//GUARDAR CARILLAS
document.getElementById('guardar-carillas').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('carilla').value;
    var directaResina = document.getElementById('directa-resina');
    var laminadoCeramica = document.getElementById('laminado-ceramica');
    var laminadoResina = document.getElementById('laminado-resina');
    var procesos = [directaResina,laminadoCeramica,laminadoResina];

    guardarProceso(procesoPadre,procesos,diente,'');
});

//GUARDAR IMPLANTES
document.getElementById('guardar-implantes').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso-implantes').value;
    var implante = document.getElementById('implante');
    var anotaciones = document.getElementById('anotaciones-implante').value;
    var procesos = [implante];

    guardarProceso(procesoPadre,procesos,diente,anotaciones);
});

//GUARDAR ENDODONCIAS
document.getElementById('guardar-endodoncias').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso-endodoncia').value;
    var apicectomia = document.getElementById('endodoncia-apicectomia');
    var retratamiento = document.getElementById('endodoncia-retratamiento');
    var molarSuperior = document.getElementById('endodoncia-molarSuperior');
    var molarInferior = document.getElementById('endodoncia-molarInferior');
    var anterior = document.getElementById('endodoncia-anterior');
    var preMolar = document.getElementById('endodoncia-preMolar');
    var procesos = [apicectomia,retratamiento,molarSuperior,molarInferior,anterior,preMolar];

    guardarProceso(procesoPadre,procesos,diente,'');
})

//GUARDAR LIMPIEZA DENTAL
document.getElementById('guardar-limpieza').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso-limpieza-dental').value;
    var limpieza = document.getElementById('limpieza-dental');
    var procesos = [limpieza];

    guardarProceso(procesoPadre,procesos,diente,'');


});

//GUARDAR BLANQUIAMIENTOS
document.getElementById('guardar-blanquiamientos').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso-blanquiamientos').value;
    var bInterno = document.getElementById('b-interno');
    var bExterno = document.getElementById('b-externo');
    var bOtros = document.getElementById('b-otros');
    var anotaciones = document.getElementById('b-anotaciones').value;

    var procesos = [bInterno,bExterno,bOtros];

    guardarProceso(procesoPadre,procesos,diente,anotaciones);

})

//GUARDAR PROTESIS
document.getElementById('guardar-protesis').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso-protesis').value;
    var protesisCompleta = document.getElementById('protesis-completa');
    var protesisPPR = document.getElementById('protesis-ppr');
    var otrasProtesis = document.getElementById('protesis-otros');
    var anotaciones = document.getElementById('protesis-anotaciones').value;
    var procesos = [protesisCompleta,protesisPPR,otrasProtesis];
    guardarProceso(procesoPadre,procesos,diente,anotaciones);
});

//GUARDAR RADIOGRAFIAS
document.getElementById('guardar-c1').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso-radiografiaC1').value;
    var d11 = document.getElementById('pieza11');
    var d12 = document.getElementById('pieza12');
    var d13 = document.getElementById('pieza13');
    var d14 = document.getElementById('pieza14');
    var d15 = document.getElementById('pieza15');
    var d16 = document.getElementById('pieza16');
    var d17 = document.getElementById('pieza17');
    var d18 = document.getElementById('pieza18');
    var procesos = [d11,d12,d13,d14,d15,d16,d17,d18];
    guardarRadiografias(procesoPadre,procesos,'');
    document.getElementById('guardar-c1').reset();
});

document.getElementById('guardar-c2').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso-radiografiaC2').value;
    var d21 = document.getElementById('pieza21');
    var d22 = document.getElementById('pieza22');
    var d23 = document.getElementById('pieza23');
    var d24 = document.getElementById('pieza24');
    var d25 = document.getElementById('pieza25');
    var d26 = document.getElementById('pieza26');
    var d27 = document.getElementById('pieza27');
    var d28 = document.getElementById('pieza28');
    var procesos = [d21,d22,d23,d24,d25,d26,d27,d28];
    guardarRadiografias(procesoPadre,procesos,'');
    document.getElementById('guardar-c2').reset();
});

document.getElementById('guardar-c3').addEventListener('submit',(e)=>{
    e.preventDefault();

    var procesoPadre = document.getElementById('proceso-radiografiaC3').value;
    var d31 = document.getElementById('pieza31');
    var d32 = document.getElementById('pieza32');
    var d33 = document.getElementById('pieza33');
    var d34 = document.getElementById('pieza34');
    var d35 = document.getElementById('pieza35');
    var d36 = document.getElementById('pieza36');
    var d37 = document.getElementById('pieza37');
    var d38 = document.getElementById('pieza38');

    var procesos = [d31,d32,d33,d34,d35,d36,d37,d38]

    guardarRadiografias(procesoPadre,procesos,'');
    document.getElementById('guardar-c3').reset();
});

document.getElementById('guardar-c4').addEventListener('submit',(e)=>{
    e.preventDefault();

    var procesoPadre = document.getElementById('proceso-radiografiaC4').value;
    var d41 = document.getElementById('pieza41');
    var d42 = document.getElementById('pieza42');
    var d43 = document.getElementById('pieza43');
    var d44 = document.getElementById('pieza44');
    var d45 = document.getElementById('pieza45');
    var d46 = document.getElementById('pieza46');
    var d47 = document.getElementById('pieza47');
    var d48 = document.getElementById('pieza48');

    var procesos = [d41,d42,d43,d44,d45,d46,d47,d48]

    guardarRadiografias(procesoPadre,procesos,'');
    document.getElementById('guardar-c4').reset();
});
/*-------------------------------------------------------------------------------------- */


//cambiar de estado el proceso pendiente/terminado y borrar procedimiento
document.getElementById('infoMedica').addEventListener('click',(e)=>{
    var btn =  e.target.getAttribute('btn');
    var estado = e.target.getAttribute('name');
    var id = e.target.getAttribute('id');
    if(btn==='cambiar-estado'){
        if(estado === 'Pendiente'){
            fetch('/actualizarEstado',{
                headers:{
                    'Content-Type':'application/json'
                },
                method:'POST',
                body:JSON.stringify({id,estado:'Terminado'})
            }).then(dato=>dato.text()).then(dato=>{
                mostrarHistorialMedico();
            });
        }else if(estado === 'Terminado'){
            fetch('/actualizarEstado',{
                headers:{
                    'Content-Type':'application/json'
                },
                method:'POST',
                body:JSON.stringify({id,estado:'Pendiente'})
            }).then(dato=>dato.text()).then(dato=>{
                mostrarHistorialMedico();
            });
        }
    }else if(btn==='delete-proceso'){
        swal({
            title: "Advertencia.",
            text: "Seguro que quiere borrar este procedimiento?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                //peticion para borrar
                fetch('/deleteProceso',{
                    headers:{
                        'Content-Type':'application/json'
                    },
                    method:'POST',
                    body:JSON.stringify({id})
                }).then(dato=>dato.text()).then(dato=>{
                    mostrarHistorialMedico();
                    mostrarGraficosOdontograma(expediente);
                    mostrarRestauraciones(expediente);
                    swal({
                        title:dato,
                        icon:"success"
                    });
                });
            }
          });
    }
});

/*------------ LOGICA PARA GUARDAR LOS PROCESOS A LAS SUPERFICIES MOLARES SUPERIORES ---------*/

document.getElementById('form-resina-superficie-molar-superior').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('procesoResina').value;
    var palatina = document.getElementById('palatina-superior');
    var vesticular = document.getElementById('vestibular-superior');
    var mesial = document.getElementById('mesial-superior');
    var distal = document.getElementById('distal-superior');
    var oclusal = document.getElementById('oclusal-superior');

    var arreglo = [palatina,vesticular,mesial,distal,oclusal];
    guardarSuperficies(procesoPadre,arreglo,diente,expediente,'Pendiente','');
    document.getElementById('form-resina-superficie-molar-superior').reset();
    $('#restauracionesMolaresSuperior').modal('toggle');
})

document.getElementById('form-incrustacion-superficie-molar-superior').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('procesoIResina').value;
    var palatina = document.getElementById('IRpalatina-superior');
    var vestibular = document.getElementById('IRvestibular-superior');
    var mesial = document.getElementById('IRmesial-superior');
    var distal = document.getElementById('IRdistal-superior');
    var oclusal = document.getElementById('IRoclusal-superior');
    var procesos = [palatina,vestibular,mesial,distal,oclusal]
    guardarSuperficies(procesoPadre,procesos,diente,expediente,'Pendiente','');
    document.getElementById('form-incrustacion-superficie-molar-superior').reset();
    $('#restauracionesMolaresSuperior').modal('toggle');
});

document.getElementById('guardar-superficies-incisivos-superior').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('procesoResinaSuperior').value;
    var palatina = document.getElementById('palatina-incisivo-superior');
    var vestibular = document.getElementById('vestibular-incisivo-superior');
    var mesial = document.getElementById('mesial-incisivo-superior');
    var distal = document.getElementById('distal-incisivo-superior');
    var procesos = [palatina,vestibular,mesial,distal];
    guardarSuperficies(procesoPadre,procesos,diente,expediente,'Pendiente','');
    document.getElementById('guardar-superficies-incisivos-superior').reset();
    $('#restauracionesIncisivoSuperior').modal('toggle');
})

document.getElementById('guardar-IRincisivo-superior').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceosIResianSuperior').value;
    var palatina = document.getElementById('IRpalatina-incisivo-superior');
    var vestibular = document.getElementById('IRvestibular-incisivo-superior');
    var mesial = document.getElementById('IRmesial-incisivo-superior');
    var distal = document.getElementById('IRdistal-incisivo-superior');
    var procesos = [palatina,vestibular,mesial,distal];
    
    guardarSuperficies(procesoPadre,procesos,diente,expediente,'Pendiente','');
    document.getElementById('guardar-IRincisivo-superior').reset();
    $('#restauracionesIncisivoSuperior').modal('toggle');
});

document.getElementById('guardar-superficies-molares-inferiores').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('procesoResinaMolaresInferiores').value;
    var lingual = document.getElementById('lingual-resina-molar-inferior');
    var vesticular = document.getElementById('vestibular-resina-molar-inferior');
    var mesial = document.getElementById('mesial-resina-molar-inferior');
    var distal = document.getElementById('distal-resina-molar-inferior');
    var oclusal = document.getElementById('oclusal-resina-molar-inferior');

    var arreglo = [lingual,vesticular,mesial,distal,oclusal];
    guardarSuperficies(procesoPadre,arreglo,diente,expediente,'Pendiente','');
    document.getElementById('guardar-superficies-molares-inferiores').reset();
    $('#restauracionesMolaresInferior').modal('toggle');
});

document.getElementById('guardar-IRsuperficies-molares-inferiores').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('procesoIR-molares-inferiores').value;
    var lingual = document.getElementById('lingual-IR-molar-inferior');
    var vestibular = document.getElementById('vastibular-IR-molar-inferior');
    var mesial = document.getElementById('mesial-IR-molar-inferior');
    var distal = document.getElementById('distal-IR-molar-inferior');
    var oclusal = document.getElementById('oclusal-IR-molar-inferior');

    var arreglo = [lingual,vestibular,mesial,distal,oclusal];
    guardarSuperficies(procesoPadre,arreglo,diente,expediente,'Pendiente','');
    document.getElementById('guardar-IRsuperficies-molares-inferiores').reset();
    $('#restauracionesMolaresInferior').modal('toggle');
});

document.getElementById('guardar-superficies-incisivos-inferiores').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('proceso-resina-incisivos-inferiores').value;
    var lingual = document.getElementById('lingual-resina-incisivo-inferior');
    var vestibular = document.getElementById('vestibular-resina-incisivo-inferior');
    var mesial = document.getElementById('mesial-resina-incisivo-inferior');
    var distal = document.getElementById('distal-resina-incisivo-inferior');

    var procesos = [lingual,vestibular,mesial,distal];
    guardarSuperficies(procesoPadre,procesos,diente,expediente,'Pendiente','');
    document.getElementById('guardar-superficies-incisivos-inferiores').reset();
    $('#restauracionesIncisivoInferior').modal('toggle');
})

document.getElementById('guardar-IResina-incisivos-inferior').addEventListener('submit',(e)=>{
    e.preventDefault();
    var procesoPadre = document.getElementById('procesoIR-incisivos-inferior').value;
    var lingual = document.getElementById('lingual-IR-incisivo-inferior');
    var vestibular = document.getElementById('vestibular-IR-incisivo-inferior');
    var mesial = document.getElementById('mesial-IR-incisivo-inferior');
    var distal = document.getElementById('distal-IR-incisivo-inferior');

    var procesos = [lingual,vestibular,mesial,distal];
    guardarSuperficies(procesoPadre,procesos,diente,expediente,'Pendiente','');
    document.getElementById('guardar-IResina-incisivos-inferior').reset();
    $('#restauracionesIncisivoInferior').modal('toggle');
});

/* --------------------------------------------------------------------------------------------*/
//limpiar formularios
document.getElementById('close-modal-procesos').addEventListener('click',()=>{
    document.querySelector('.process').reset();
})
//LIMPIAR SUPERFICIES Y RAIZ
document.getElementById('limpiarProcesos').addEventListener('click',()=>{
    limpiarSuperficies();
    //limpiamos las variables globales de diente y expediente
    diente = '';
    expediente = '';
});

//guardar procesos en las superficies
function guardarSuperficies(procesoPadre,procesos,diente,expediente,estado,anotaciones){
    var dienteC;
    if(diente > 10 && diente < 19 || diente > 40 && diente < 49){
        dienteC = '-';
    }else if(diente > 20 && diente < 29 || diente > 30 && diente < 39){
        dienteC = '_';
    }else if(diente > 50 && diente < 56 || diente > 60 && diente < 66){
        dienteC = '-';
    }else if(diente > 70 && diente < 76 || diente > 80 && diente < 86){
        dienteC = '_';
    }
    
    if(expediente != ''){
        procesos.forEach(e=>{
            if(e.checked){
                fetch('/guardarProceso',{
                    headers:{
                        'Content-Type':'application/json'
                    },
                    method:'POST',
                    body:JSON.stringify({diente,procesoPadre,descripcion:dienteC + e.value,expediente,estado,anotaciones})
                }).then(message=>message.text()).then(message=>{
                    mostrarRestauraciones(expediente);
                    mostrarHistorialMedico(expediente);
                });
            }
        });
        alertGuardar();
    }else if(procesos.length<1){
        swal({
            title:'Elija un procedimiento.',
            icon:'warning'
        })
    }else{
        swal({
            title:'Elija un expediente.',
            icon:'warning'
        })
    }
}
//mostrar historial medico
function mostrarHistorialMedico() {
    fetch('/historialMedico',{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({idExpedienteInfo})
    })
    .then(data=>data.json()).then(data=>{
        var color;
        //encabezado de la tabla
        var template = `
        <div class="card-body infoMedicaExpediente">
        <table class="table table-borderless table-hover">
        <thead class="thead-dark">
            <tr class="">
                <th>Proceso</th>
                <th>Descripción</th>
                <th>Nota</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>`

        data.forEach(info=>{
            if(info.estado === 'Pendiente'){
                color="btn-primary"
            }else if(info.estado === 'Terminado'){
                color="btn-success"
            }

            if(info.proceso === 'Limpieza Dental'){
                template += `
                <tr>
                    <td class="p-2">${info.proceso}</td>
                    <td class="p-2">${info.descripcion}</td>
                    <td class="p-2">${info.Anotaciones}</td>
                    <td class="p-2">
                        <button class="btn ${color} btn-sm" id="${info.id}" name="${info.estado}" btn="cambiar-estado">${info.estado}</button>
                        <button class="btn btn-default btn-sm" id="${info.id}" name="${info.estado}" btn="delete-proceso"><span id="${info.id}" class="text-danger icon-trash-empty" btn="delete-proceso"/></button>
                    </td>
                </tr>`;
            }else if(info.descripcion === 'Protesis completa'){
                template += `
                <tr>
                    <td class="p-2">${info.proceso}</td>
                    <td class="p-2">${info.descripcion}</td>
                    <td class="p-2">${info.Anotaciones}</td>
                    <td class="p-2">
                        <button class="btn ${color} btn-sm" id="${info.id}" name="${info.estado}" btn="cambiar-estado">${info.estado}</button>
                        <button class="btn btn-default btn-sm" id="${info.id}" name="${info.estado}" btn="delete-proceso"><span id="${info.id}" class="text-danger icon-trash-empty" btn="delete-proceso"/></button>
                    </td>
                </tr>`;
            }else{
                template += `
                <tr>
                    <td class="p-2">${info.proceso}</td>
                    <td class="p-2">${info.nDiente} / ${info.descripcion} ${info.ubicacionDiente}</td>
                    <td class="p-2">${info.Anotaciones}</td>
                    <td class="p-2">
                        <button class="btn ${color} btn-sm" id="${info.id}" name="${info.estado}" btn="cambiar-estado">${info.estado}</button>
                        <button class="btn btn-default btn-sm" id="${info.id}" name="${info.estado}" btn="delete-proceso"><span id="${info.id}" class="text-danger icon-trash-empty" btn="delete-proceso"/></button>
                        </td>
                </tr>`;
            }
        });

        template += `</tbody>
                        </table>
                    </div>`;

        document.getElementById('infoMedica').innerHTML = template;
    });
}
//mostrar los procesos graficamente en el odontograma segun el historial del expediente
function mostrarGraficosOdontograma(expediente) {
    var s5 = [14,15,16,17,18,24,25,26,27,28,44,45,46,47,48,34,35,36,37,38,54,55,64,65,74,75,84,85];
    var s4 = [11,12,13,21,22,23,41,42,43,31,32,33,51,52,53,61,62,63,71,72,73,81,82,83];
    var ss = [11,12,13,14,15,16,17,18,21,22,23,24,25,26,27,28,51,52,53,54,55,61,62,63,64,65];
    var si = [31,32,33,34,35,36,37,38,41,42,43,44,45,46,47,48,71,72,73,74,75,81,82,83,84,85];
    var molaresS = [16,17,18,26,27,28,54,55,64,65];
    var molaresI = [36,37,38,46,47,48,74,75,84,85];
    var incisivosS = [11,12,13,14,15,21,22,23,24,25,51,52,53,61,62,63];
    var incisivosI = [31,32,33,34,35,41,42,43,44,45,71,72,73,81,82,83];
    var pieza;
    fetch('/historialExpediente', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({expediente})
    }).then(datos => datos.json()).then(datos => {
        $('.diente span').text('');
        datos.forEach(proceso => {
            switch(removeAccents(proceso.proceso)){
                case 'Extraccion':{
                    ss.forEach(e=>{
                        if(proceso.diente === e){
                            document.querySelector('#diente' + proceso.diente).innerHTML = `<img src="img/extraccion.png" class="extraccion" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                    si.forEach(e=>{
                        if(proceso.diente === e){
                            document.querySelector('#diente' + proceso.diente).innerHTML = `<img src="img/extraccion-inferior.png" class="extraccion-inferior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                }break;
                case 'Restauracion':{
                    si.forEach(e=>{
                        if(proceso.diente == e){
                            document.querySelector('#diente' + proceso.diente).innerHTML += `<img src="img/posteIncisivoInferior.png" class="posteIncisivoInferior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                    ss.forEach(e=>{
                        if(proceso.diente == e){
                            document.querySelector('#diente' + proceso.diente).innerHTML += `<img src="img/posteIncisivoSuperior.png" class="posteIncisivoSuperior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                }break;
                case 'Corona':{
                    s5.forEach(e=>{
                        if(proceso.diente == e){
                            for (let index = 1; index < 6; index++) {
                                pieza = document.getElementById(`s${index}de5-${proceso.diente}`);
                                if(pieza.getAttribute('class') == `s${index}de5`){
                                    pieza.removeAttribute('class',`s${index}de5`);
                                    pieza.setAttribute('class',`s${index}de5Corona`);
                                }
                            }
                        }
                    });
                    s4.forEach(e=>{
                        if(proceso.diente == e){
                            for (let index = 1; index < 5; index++) {
                                pieza = document.getElementById(`s${index}de4-${proceso.diente}`);
                                if(pieza.getAttribute('class') == `s${index}de4`){
                                    pieza.removeAttribute('class',`s${index}de4`);
                                    pieza.setAttribute('class',`s${index}de4Corona`);
                                }
                            }
                        }
                    });
                }break;
                case 'Blanquiamiento':{
                    s5.forEach(e=>{
                        if(proceso.diente == e){
                            for (let index = 1; index < 6; index++) {
                                pieza = document.getElementById(`s${index}de5-${proceso.diente}`);
                                if(pieza.getAttribute('class') == `s${index}de5`){
                                    pieza.removeAttribute('class',`s${index}de5`);
                                    pieza.setAttribute('class',`s${index}de5Blanquiamientos`);
                                }
                            }
                        }
                    });
                    s4.forEach(e=>{
                        if(proceso.diente == e){
                            for (let index = 1; index < 5; index++) {
                                pieza = document.getElementById(`s${index}de4-${proceso.diente}`);
                                if(pieza.getAttribute('class') == `s${index}de4`){
                                    pieza.removeAttribute('class',`s${index}de4`);
                                    pieza.setAttribute('class',`s${index}de4Blanquiamientos`);
                                }
                            }
                        }
                    });
                }break;
                case 'Carilla':{
                    var element4;
                    var element;
                    si.forEach((e)=>{
                        if(e === proceso.diente){
                            element4 = document.getElementById('s1de4-'+proceso.diente);
                            element = document.getElementById('s1de5-'+proceso.diente);
                            if(element === null && element4 != null){
                            element4.removeAttribute('class','s1de4');
                            element4.setAttribute('class','s1de4Carilla');
                            }else if(element != null && element4 === null){
                                element.removeAttribute('class','s1de5');
                                element.setAttribute('class','s1de5Carilla');
                            }
                        }
                    });
                    ss.forEach((e)=>{
                        if(e === proceso.diente){
                            element4 = document.getElementById('s3de4-'+proceso.diente);
                            element = document.getElementById('s3de5-'+proceso.diente);
                            if(element === null && element4 != null){
                            element4.removeAttribute('class','s3de4');
                            element4.setAttribute('class','s3de4Carilla');
                            }else if(element != null && element4 === null){
                                element.removeAttribute('class','s3de5');
                                element.setAttribute('class','s3de5Carilla');
                            }
                        }
                    });
                }break;
                case 'Implante':{
                    si.forEach(e=>{
                        if(proceso.diente == e){
                            document.querySelector('#diente' + proceso.diente).innerHTML = `<img src="img/Iinferior.png" class="Iinferior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                    ss.forEach(e=>{
                        if(proceso.diente == e){
                            document.querySelector('#diente' + proceso.diente).innerHTML = `<img src="img/Isuperior.png" class="Isuperior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                }break;
                case 'Endodoncia':{
                    molaresS.forEach(e=>{
                        if(proceso.diente == e){
                            document.querySelector('#diente' + proceso.diente).innerHTML += `<img src="img/endodonciaMolarSuperior.png" class="endodonciaMolarSuperior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                    molaresI.forEach(e=>{
                        if(proceso.diente == e){
                            document.querySelector('#diente' + proceso.diente).innerHTML += `<img src="img/endodonciaMolarInferior.png" class="endodonciaMolarInferior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                    incisivosS.forEach(e=>{
                        if(proceso.diente == e){
                            document.querySelector('#diente' + proceso.diente).innerHTML += `<img src="img/endodonciaIncisivoSuperior.png" class="endodonciaIncisivoSuperior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                    incisivosI.forEach(e=>{
                        if(proceso.diente == e){
                            document.querySelector('#diente' + proceso.diente).innerHTML += `<img src="img/endodonciaIncisivoInferior.png" class="endodonciaIncisivoInferior" diente="raiz" id="${proceso.diente}" data-toggle="modal" data-target="#ingresoDiagnostico"/>`;
                        }
                    });
                }break;
                default:break;
            }
        })
    });
}

//mostrar las restauraciones de resina en el odontograma segun el historial expediente
function mostrarRestauraciones(expediente) {
    var parteSuperior = [11,12,13,14,15,16,17,18,21,22,23,24,25,26,27,28,51,52,53,54,55,61,62,63,64,65];
    var parteInferior = [31,32,33,34,35,36,37,38,41,42,43,44,45,46,47,48,71,72,73,74,75,81,82,83,84,85];
    fetch('/mostrarRestauraciones',{
        headers:{
            'Content-Type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({expediente})
    }).then(restauracion=>restauracion.json()).then(restauracion=>{
        var element;
        var element4;
        restauracion.forEach(res=>{
            switch (removeAccents(res.descripcion)) {
                case '-Resina en superficie palatina':{
                    element = document.getElementById('s1de5-'+res.diente);
                    element4 = document.getElementById('s1de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s1de4');
                        element4.setAttribute('class','s1de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s1de5');
                        element.setAttribute('class','s1de5Color');
                    }
                }break;
                case '_Resina en superficie palatina':{
                    element = document.getElementById('s1de5-'+res.diente);
                    element4 = document.getElementById('s1de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s1de4');
                        element4.setAttribute('class','s1de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s1de5');
                        element.setAttribute('class','s1de5Color');
                    }
                }break;
                case '-Resina en superficie vestibular':{
                    parteSuperior.forEach(e=>{
                        if(res.diente === e){
                            element = document.getElementById('s3de5-'+res.diente);
                            element4 = document.getElementById('s3de4-'+res.diente);
                            if(element === null && element4 != null){
                                element4.removeAttribute('class','s3de4');
                                element4.setAttribute('class','s3de4Color');
                            }else if(element4 === null && element != null){
                                element.removeAttribute('class','s3de5');
                                element.setAttribute('class','s3de5Color');
                            }
                        }
                    });
                    parteInferior.forEach(e=>{
                        if(res.diente === e){
                            element = document.getElementById('s1de5-'+res.diente);
                            element4 = document.getElementById('s1de4-'+res.diente);
                            if(element === null && element4 != null){
                                element4.removeAttribute('class','s1de4');
                                element4.setAttribute('class','s1de4Color');
                            }else if(element4 === null && element != null){
                                element.removeAttribute('class','s1de5');
                                element.setAttribute('class','s1de5Color');
                            }
                        }
                    });
                }break;
                case '_Resina en superficie vestibular':{
                    parteSuperior.forEach(e=>{
                        if(res.diente === e){
                            element = document.getElementById('s3de5-'+res.diente);
                            element4 = document.getElementById('s3de4-'+res.diente);
                            if(element === null && element4 != null){
                                element4.removeAttribute('class','s3de4');
                                element4.setAttribute('class','s3de4Color');
                            }else if(element4 === null && element != null){
                                element.removeAttribute('class','s3de5');
                                element.setAttribute('class','s3de5Color');
                            }
                        }
                    });
                    parteInferior.forEach(e=>{
                        if(res.diente === e){
                            element = document.getElementById('s1de5-'+res.diente);
                            element4 = document.getElementById('s1de4-'+res.diente);
                            if(element === null && element4 != null){
                                element4.removeAttribute('class','s1de4');
                                element4.setAttribute('class','s1de4Color');
                            }else if(element4 === null && element != null){
                                element.removeAttribute('class','s1de5');
                                element.setAttribute('class','s1de5Color');
                            }
                        }
                    });
                }break;
                case '-Resina en superficie distal':{
                    element = document.getElementById('s4de5-'+res.diente);
                    element4 = document.getElementById('s4de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s4de4');
                        element4.setAttribute('class','s4de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s4de5');
                        element.setAttribute('class','s4de5Color');
                    }
                }break;
                case '_Resina en superficie distal':{
                    element = document.getElementById('s2de5-'+res.diente);
                    element4 = document.getElementById('s2de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s2de4');
                        element4.setAttribute('class','s2de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s2de5');
                        element.setAttribute('class','s2de5Color');
                    }
                }break;
                case '-Resina en superficie mesial':{
                    element = document.getElementById('s2de5-'+res.diente);
                    element4 = document.getElementById('s2de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s2de4');
                        element4.setAttribute('class','s2de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s2de5');
                        element.setAttribute('class','s2de5Color');
                    }
                }break;
                case '_Resina en superficie mesial':{
                    element = document.getElementById('s4de5-'+res.diente);
                    element4 = document.getElementById('s4de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s4de4');
                        element4.setAttribute('class','s4de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s4de5');
                        element.setAttribute('class','s4de5Color');
                    }
                }break;
                case '-Resina en superficie oclusal':{
                    element = document.getElementById('s5de5-'+res.diente);
                    element.removeAttribute('class','s5de5');
                    element.setAttribute('class','s5de5Color');
                }break;
                case '_Resina en superficie oclusal':{
                    element = document.getElementById('s5de5-'+res.diente);
                    element.removeAttribute('class','s5de5');
                    element.setAttribute('class','s5de5Color');
                }break;
                case '-Resina en superficie lingual':{
                    element = document.getElementById('s3de5-'+res.diente);
                    element4 = document.getElementById('s3de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s3de4');
                        element4.setAttribute('class','s3de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s3de5');
                        element.setAttribute('class','s3de5Color');
                    }
                }break;
                case '_Resina en superficie lingual':{
                    element = document.getElementById('s3de5-'+res.diente);
                    element4 = document.getElementById('s3de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s3de4');
                        element4.setAttribute('class','s3de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s3de5');
                        element.setAttribute('class','s3de5Color');
                    }
                }break;
                case '-Incrustacion de resina en superficie palatina':{
                    element = document.getElementById('s1de5-'+res.diente);
                    element4 = document.getElementById('s1de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s1de4');
                        element4.setAttribute('class','s1de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s1de5');
                        element.setAttribute('class','s1de5Color');
                    }
                }break;
                case '_Incrustacion de resina en superficie palatina':{
                    element = document.getElementById('s1de5-'+res.diente);
                    element4 = document.getElementById('s1de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s1de4');
                        element4.setAttribute('class','s1de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s1de5');
                        element.setAttribute('class','s1de5Color');
                    }
                }break;
                case '-Incrustacion de resina en superficie vestibular':{
                    parteSuperior.forEach(e=>{
                        if(res.diente === e){
                            element = document.getElementById('s3de5-'+res.diente);
                            element4 = document.getElementById('s3de4'+res.diente);
                            if(element === null && element4 != null){
                                element.removeAttribute('class','s3de4');
                                element.setAttribute('class','s3de4Color');
                            }else if(element4 === null && element != null){
                                element.removeAttribute('class','s3de5');
                                element.setAttribute('class','s3de5Color');
                            }
                        }
                    });
                    parteInferior.forEach(e=>{
                        if(res.diente === e){
                            element = document.getElementById('s1de5-'+res.diente);
                            element4 = document.getElementById('s1de4'+res.diente);
                            if(element === null && element4 != null){
                                element.removeAttribute('class','s1de4');
                                element.setAttribute('class','s1de4Color');
                            }else if(element4 === null && element != null){
                                element.removeAttribute('class','s1de5');
                                element.setAttribute('class','s1de5Color');
                            }
                        }
                    });
                }break;
                case '_Incrustacion de resina en superficie vestibular':{
                    parteSuperior.forEach(e=>{
                        if(res.diente === e){
                            element = document.getElementById('s3de5-'+res.diente);
                            element4 = document.getElementById('s3de4'+res.diente);
                            if(element === null && element4 != null){
                                element.removeAttribute('class','s3de4');
                                element.setAttribute('class','s3de4Color');
                            }else if(element4 === null && element != null){
                                element.removeAttribute('class','s3de5');
                                element.setAttribute('class','s3de5Color');
                            }
                        }
                    });
                    parteInferior.forEach(e=>{
                        if(res.diente === e){
                            element = document.getElementById('s1de5-'+res.diente);
                            element4 = document.getElementById('s1de4'+res.diente);
                            if(element === null && element4 != null){
                                element.removeAttribute('class','s1de4');
                                element.setAttribute('class','s1de4Color');
                            }else if(element4 === null && element != null){
                                element.removeAttribute('class','s1de5');
                                element.setAttribute('class','s1de5Color');
                            }
                        }
                    });
                }break;
                case '-Incrustacion de resina en superficie mesial':{
                    element = document.getElementById('s2de5-'+res.diente);
                    element4 = document.getElementById('s2de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s2de4');
                        element4.setAttribute('class','s2de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s2de5');
                        element.setAttribute('class','s2de5Color');
                    }
                }break;
                case '_Incrustacion de resina en superficie mesial':{
                    element = document.getElementById('s4de5-'+res.diente);
                    element4 = document.getElementById('s4de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s4de4');
                        element4.setAttribute('class','s4de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s4de5');
                        element.setAttribute('class','s4de5Color');
                    }
                }break;
                case '-Incrustacion de resina en superficie distal':{
                    element = document.getElementById('s4de5-'+res.diente);
                    element4 = document.getElementById('s4de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s4de4');
                        element4.setAttribute('class','s4de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s4de5');
                        element.setAttribute('class','s4de5Color');
                    }
                }break;
                case '_Incrustacion de resina en superficie distal':{
                    element = document.getElementById('s2de5-'+res.diente);
                    element4 = document.getElementById('s2de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s2de4');
                        element4.setAttribute('class','s2de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s2de5');
                        element.setAttribute('class','s2de5Color');
                    }
                }break;
                case '-Incrustacion de resina en superficie oclusal':{
                    element = document.getElementById('s5de5-'+res.diente);
                    element.removeAttribute('class','s5de5');
                    element.setAttribute('class','s5de5Color');
                }break;
                case '_Incrustacion de resina en superficie oclusal':{
                    element = document.getElementById('s5de5-'+res.diente);
                    element.removeAttribute('class','s5de5');
                    element.setAttribute('class','s5de5Color');
                }break;                
                case '-Incrustacion de resina superficie lingual':{
                    element = document.getElementById(`s3de5-${res.diente}`);
                    element4 = document.getElementById('s3de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s3de4');
                        element4.setAttribute('class','s3de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s3de5');
                        element.setAttribute('class','s3de5Color');
                    }
                }break;
                case '_Incrustacion de resina superficie lingual':{
                    element = document.getElementById(`s3de5-${res.diente}`);
                    element4 = document.getElementById('s3de4-'+res.diente);
                    if(element === null && element4 != null){
                        element4.removeAttribute('class','s3de4');
                        element4.setAttribute('class','s3de4Color');
                    }else if(element4 === null && element != null){
                        element.removeAttribute('class','s3de5');
                        element.setAttribute('class','s3de5Color');
                    }
                }break;
                default:
                    break;
            }
        });
    });
}

//guardar radiografias
function guardarRadiografias(procesoPadre,procesos,anotaciones) {
    if(expediente!=0){
        var validar = [];
        // recorremos el array
        procesos.forEach(e => {
            if (e.checked) { // add solo los true al arreglo validar
                validar.push(e);
            }
        });

        if(validar.length < 1){
            swal({
                title:'Seleccione un procedimiento.',
                icon:'warning'
            });
        }else{
            //validar que solo los checkbox checkados sean lo que se guardaran
            procesos.forEach(e=>{
                if(e.checked){
                    //obtengo el contenido de la descripcon del procedimiento checkado
                    fetch('/guardarProceso',{
                        headers:{
                            'Content-Type':'application/json'
                        },
                        method:'POST',
                        body:JSON.stringify({diente:e.value,procesoPadre,descripcion:e.value,expediente,estado:'Pendiente',anotaciones})
                    }).then(message=>message.text()).then(message=>{
                        mostrarGraficosOdontograma(expediente);
                        mostrarHistorialMedico(expediente);
                        swal({
                            title:message,
                            icon:'success'
                        });
                    });
                }
            });
        }

    }else{
        //message
        swal({
            title:'Elija un expedinte',
            icon:'warning'
        });
    }
}

// guardar procesos
function guardarProceso(procesoPadre,procesos,diente,anotaciones) {
    if(expediente!=0){
        var validar = [];
        // recorremos el array
        procesos.forEach(e => {
            if (e.checked) { // add solo los true al arreglo validar
                validar.push(e);
            }
        });

        if(validar.length > 1){
            swal({
                title:'Solo puede elejir una extraccion por pieza dental.',
                icon:'warning'
            });
        }else if(validar.length < 1){
            swal({
                title:'Seleccione un procedimiento.',
                icon:'warning'
            });
        }else{
            //validar que solo los checkbox checkados sean lo que se guardaran
            procesos.forEach(e=>{
                if(e.checked){
                    //obtengo el contenido de la descripcon del procedimiento checkado
                    fetch('/guardarProceso',{
                        headers:{
                            'Content-Type':'application/json'
                        },
                        method:'POST',
                        body:JSON.stringify({diente,procesoPadre,descripcion:e.value,expediente,estado:'Pendiente',anotaciones})
                    }).then(message=>message.text()).then(message=>{
                        mostrarGraficosOdontograma(expediente);
                        mostrarHistorialMedico(expediente);
                        swal({
                            title:message,
                            icon:'success'
                        });
                    });
                }
            });
        }

    }else{
        //message
        swal({
            title:'Elija un expedinte',
            icon:'warning'
        });
    }
}

document.getElementById('close-modal-infoProcessExpediente').addEventListener('click',()=>{
    $('#infoProcessExpediente').hide();
});

//mensaje al guardar procesos en las superficies
function alertGuardar() {
    var element = document.createElement('div');
    element.setAttribute('class','alert alert-success alert-dismissible fade show');
    element.setAttribute('role','alert');
    element.innerHTML = `
                            <strong>Exito!</strong> Procedimiento guardado exitosamente.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>                        
                        `;
    document.getElementById('encabezado-carta-dentadura').append(element);
    setTimeout(function(){
        element.remove();
    },2000);
}

