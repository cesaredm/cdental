const express = require('express');
const { render } = require('ejs');
const router = express.Router();
const moment = require('moment');
const passport = require('passport');
const helpers = require('../lib/helpers');
const conexion = require('../conexion');
const { authenticate } = require('passport');
const nodemailer = require('nodemailer');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');//para validar si esta logueado o no "isLoggedIn"


moment.locale('es');


//login
router.get('/',isNotLoggedIn ,(req, res)=>{
    res.render('index.html');
});
//validacion de login
router.post('/login', async (req, res, next)=>{
    const {userName, pass} = req.body;
    passport.authenticate('local.login',{
        successRedirect:'/menu',
        failureRedirect: '/',
        failureFlash:true
    })(req, res, next);
});
//cerrar sesion
router.get('/logout',(req, res)=>{
    req.logOut();
    res.redirect('/');
});
//mostrar menu
router.get('/menu',isLoggedIn,  async (req, res)=>{
    res.render('menu.html');
});
//mostrar citas
router.get('/showCitas',isLoggedIn ,async (req,res)=>{
    try {
        const query = `
        SELECT c.id,c.nombres,c.apellidos,telefono, DATE_FORMAT(fecha,"%Y-%m-%d") as fecha,horaInicio,horaFinal,anotaciones,correo,d.nombres as nombresDentista,
	    d.apellidos as apellidosDentista,color FROM citas AS c LEFT JOIN dentistas as d on(c.dentista=d.id) `;
        const citas = await conexion.query(query);
        res.send(citas);
    } catch (error) {
        console.log(error);
    }
})
//mostrar citas en diagnostico
router.get('/showCitasDiagnostico', isLoggedIn ,async (req,res)=>{
    try {
        var fecha = moment().format("YYYY-MM-DD");
        var query = `SELECT c.id,c.nombres,c.apellidos,telefono,fecha,horaInicio,horaFinal,anotaciones,d.nombres
                         as nombresDentista,
                            d.apellidos as apellidosDentista,color 
                                FROM citas AS c LEFT JOIN dentistas as d on(c.dentista=d.id) 
                                    WHERE fecha = ? AND c.estado = 'pendiente' ORDER BY horaInicio`;
        const citas = await conexion.query(query,[fecha]);
        res.send(citas);
    } catch (error) {
        console.log(error);
    }
});
//mostrar porocesos en modal de prodcesos en diagnostico
router.get('/MostrarProcesos',async (req,res)=>{
    const procesos = await conexion.query("SELECT nombre FROM proceso");
    res.send(procesos);
}); 
//mostrar subporocesos en modal de prodcesos en diagnostico
router.post('/proceso', async(req,res)=>{
    let proceso = req.body.proceso;
    console.log(proceso);
    const subProcesos = await conexion.query("SELECT p.nombre AS proceso, sp.id, sp.nombre FROM proceso AS p INNER JOIN sub_proceso AS sp ON(p.id=sp.proceso) WHERE p.nombre = ?", [proceso]);
    res.send(subProcesos);
});
//mostrar restauraciones
router.get('/mostrarRestauraciones',async(req,res)=>{
    try {
        const restauraciones = await conexion.query("SELECT sp.* FROM sub_proceso AS sp INNER JOIN proceso AS p ON(sp.proceso=p.id) WHERE p.nombre='Restauraciones'");
        res.send(restauraciones);
    } catch (error) {
        res.send(error);
    }
});
//guardar usuarios
router.post('/saveUsers',isLoggedIn ,async (req, res)=>{
    const {usuario, password} = req.body;
    var newUser = {usuario, password};
    try {
        //newUser.password = await helpers.encryptPassword(password);
        await conexion.query("INSERT INTO usuarios SET ?",[newUser]);
        res.send('Usuario guardado exitosamente.')
    } catch (error) {
        console.log(error);
    }
});
//mostrar usuarios
router.get('/getUsers', isLoggedIn ,async (req,res)=>{
    try {
        const users = await conexion.query("SELECT * FROM usuarios");
        res.send(users)
    } catch (error) {
        console.log(error);
    }
});
//borrar usuario
router.post('/borrarUser',isLoggedIn,async (req,res)=>{
    try {
        const {id} = req.body;
        await conexion.query("DELETE FROM usuarios WHERE id =?",[id]);
        res.send('Usuario eliminado exitosamente');
    } catch (error) {
        console.log(error);
    }
})
//mostrar datos de usuario para se editados
router.post('/editarUser',isLoggedIn,async (req,res)=>{
    try {
        const {id} = req.body;
        const user = await conexion.query("SELECT * FROM usuarios WHERE id = ?",[id]);
        res.send(user);
    } catch (error) {
        console.log(error);
    }
});
//actualizar usuarios
router.post('/updateUser',isLoggedIn,async(req,res)=>{
    try {
        const {id,usuario, password} = req.body;
        await conexion.query("UPDATE usuarios SET usuario = ?, password = ? WHERE id = ?", [usuario, password, id]);
        res.send('Usuario actualizado exitosamente.')
    } catch(e) {
        // statements
        console.log(e);
    }
})
//llenar form citas para actualizar
router.post('/editCita',isLoggedIn,async (req,res)=>{
    const {id} = req.body;
    const cita = await conexion.query("SELECT * FROM citas WHERE id = ?", [id]);
    res.send(cita);
});
//guardar dentistas
router.post('/saveDentista',isLoggedIn,async(req,res)=>{
    try {
        const {nombreDentista,apellidoDentista,colorDentista} = req.body;
        const newDentist = {
            nombres:nombreDentista,
            apellidos:apellidoDentista,
            color:colorDentista
        }
        await conexion.query("INSERT INTO dentistas set ?",[newDentist]);
        res.send('Dentista Guardado Exitosamente.');
    } catch (error) {
        res.send(error);
    }
});
//borrar dentista
router.post('/deleteDentista',isLoggedIn,async(req,res)=>{
    try {
        const {id} = req.body;

        await conexion.query("DELETE FROM dentistas WHERE id = ?",[id]);

        res.send('Dentista eliminado exitosamente.');
    } catch (error) {
        res.send(error);
    }
});
//editar dentista
router.post('/editDentista',isLoggedIn,async(req,res)=>{
    const {id} = req.body;

    try {
        const dentistas = await conexion.query("SELECT * FROM dentistas WHERE id = ?",[id]);

        res.send(dentistas);
    } catch (error) {
        res.send(error);
    }
});
//actualizar dentista
router.post('/updateDentista',isLoggedIn,async(req,res)=>{
    const {id,nombreDentista,apellidoDentista,colorDentista} = req.body;

    try {
        await conexion.query("UPDATE dentistas SET nombres = ?, apellidos = ?, color = ? WHERE id = ?", [nombreDentista,apellidoDentista,colorDentista,id]);
        res.send('Dentista actualizado exitosamente.');
    } catch (error) {
        res.send(error);
    }
});
//mostrar dentistas
router.post('/mostrarDentistas',isLoggedIn,async(req,res)=>{
    try {
        const {dato} = req.body;
        const datos = await conexion.query("SELECT * FROM dentistas WHERE CONCAT(id, nombres, apellidos) LIKE ?", '%'+[dato]+'%');

        res.send(datos);
    } catch (error) {
        
    }
})
//llenar datos en el formulario expedienete
router.post('/llenarExpediente',isLoggedIn,async (req,res)=>{
    const {id} = req.body;
    try {
        const datosCita = await conexion.query("SELECT * FROM citas WHERE id = ?",[id]);
        res.send(datosCita);
    } catch (error) {
        console.log(error);
    }
});
//guardar expediente
router.post('/saveExpediente',isLoggedIn, async (req,res)=>{
    const {nombres, apellidos, telefono, sexo, edad, nacionalidad, fecha,anotaciones} = req.body;
    try {
        await conexion.query("INSERT INTO expediente set ?", [{nombres, apellidos, telefono, sexo, edad, nacionalidad, fecha,anotaciones}]);
        res.send('Expediente guardado exitosamente.');
    } catch (error) {
        console.log(error);
    }
});
//editar expediente
router.post('/editExpediente',isLoggedIn,async(req,res)=>{
    try {
        const {id} = req.body;
        const datos = await conexion.query("SELECT * FROM expediente WHERE id=?",[id]);
        res.send(datos);
    } catch (error) {
        res.send(error);
    }
});
//borrar expediente
router.post('/deleteExpediente',isLoggedIn,async(req,res)=>{
    try {
        const {id} = req.body;
        await conexion.query("DELETE FROM expediente WHERE id = ?",[id]);
        res.send('Expediente eliminado exitosamente.');
    } catch (error) {
        res.send(error);
    }
});
//actualizar expediente
router.post('/updateExpediente',async(req,res)=>{
    const {id,nombres, apellidos, telefono, sexo, edad, nacionalidad, fecha,anotaciones} = req.body;
    try {
        await conexion.query("UPDATE expediente SET nombres = ?, apellidos = ?, telefono = ?, sexo = ?, edad = ?, nacionalidad = ?, fecha = ?, anotaciones = ? WHERE id = ?", [nombres, apellidos, telefono, sexo, edad, nacionalidad, fecha,anotaciones,id]);
        res.send('Expediente actualizado exitosamente.');
    } catch (error) {
        console.log(error);
    }
});
//lista de expedientes
router.get('/expedientes',async (req,res)=>{
    try {
        const expedientes = await conexion.query("SELECT * FROM expediente ORDER BY nombres");
        res.send(expedientes);
    } catch (error) {
        console.log(error);
    }
});
//buscar expedientes
router.post('/buscarExp',isLoggedIn,async(req,res)=>{
    try {
        const {dato} = req.body;
        const expedientes = await conexion.query("SELECT * FROM expediente WHERE CONCAT(id, nombres, apellidos) like ? ORDER BY nombres",'%'+[dato]+'%');
        res.send(expedientes);
    } catch(e) {
        // statements
        console.log(e);
    }
});
//info de expediente especifico
router.post('/infoExpediente',isLoggedIn,async(req,res)=>{
    try {
        const {idExpedienteInfo} = req.body;
        const info = await conexion.query("SELECT * FROM expediente WHERE id = ?",[idExpedienteInfo]);
        res.send(info);
    } catch (error) {
        console.log(error);
    }
});
//histrorial de expediente
router.post('/historialExpediente',isLoggedIn,async(req,res)=>{
    try {
        const {expediente} = req.body;
        let query = `SELECT ep.* FROM expediente_proceso AS ep INNER JOIN expediente AS e ON(ep.expediente=e.id) WHERE e.id = ?`;
        const info = await conexion.query(query,[expediente]);
        res.send(info);
    } catch (error) {
        console.log(error);
    }
});
//informacion de historial medico
router.post('/historialMedico',isLoggedIn,async(req,res)=>{
    try {
        const {idExpedienteInfo} = req.body;
        let query = `SELECT ep.id,proceso,descripcion,estado,ep.Anotaciones,d.nDiente,nombre AS ubicacionDiente FROM expediente_proceso
                        AS ep INNER JOIN expediente AS e ON(ep.expediente=e.id) 	
                            INNER JOIN dientes AS d ON(d.nDiente = ep.diente) WHERE e.id = ? ORDER BY ep.id DESC`;
        const info = await conexion.query(query,[idExpedienteInfo]);
        res.send(info);
    } catch (error) {
        res.send(error);
    }
})
//procesos por diente
router.post('/procesoDiente',isLoggedIn,async(req,res)=>{
    try {
        const {diente,proceso,expediente} = req.body;
        const query = `select sp.nombre from sub_proceso as sp
                        inner join expediente_proceso ep on(ep.subProceso=sp.id)
                                inner join expediente as e on(ep.expediente=e.id)
                                        inner join proceso as p on(p.id=sp.proceso)
                                                inner join dientes as d on(d.nDiente=ep.diente)
                                                        where e.id = ? and d.nDiente = ? and p.nombre = ? and ep.estado='Pendiente'`;
        const sp = await conexion.query(query,[expediente,diente,proceso]);
        res.send(sp);
    } catch (error) {
        console.log(error);
    }
    
})
//actualizar estado del proceso
router.post('/actualizarEstado',isLoggedIn,async(req,res)=>{
    try {
        const {id,estado} = req.body;
        await conexion.query("UPDATE expediente_proceso SET estado = ? WHERE id = ?", [estado,id]);
        res.send('Actualizado..')
    } catch (error) {
        res.send(error);
    }
});
//Guardar subprocesos
router.post('/guardarProceso',isLoggedIn,async(req,res)=>{
    try {
        const {procesoPadre, diente, expediente, descripcion,estado,anotaciones} = req.body;
        let newSubProceso = {
            diente,
            proceso:procesoPadre,
            descripcion,
            expediente,
            estado,
            anotaciones
        };
        //guardar subproceso
        await conexion.query("INSERT INTO expediente_proceso set ?",[newSubProceso]);
        res.send('Procedimiento agregado exitosamente.');
    } catch (error) {
        res.send(error);
    }
});
//borrar proceso
router.post('/deleteProceso',async(req,res)=>{
    try {
        const {id} = req.body;
        await conexion.query('DELETE FROM expediente_proceso WHERE id = ?',[id]);
        res.send('Procedimiento Eliminado.');
    } catch (error) {
        console.log(error);
    }
});
//mostrar restauraciones segun expediente
router.post('/mostrarRestauraciones',isLoggedIn,async(req,res)=>{
    try {
        const {expediente} = req.body;
        const restauraciones = await conexion.query("SELECT ep.* FROM expediente_proceso AS ep INNER JOIN expediente AS e ON(ep.expediente=e.id) WHERE e.id = ? and ep.proceso = 'Resina'",[expediente]);
        res.send(restauraciones);
    } catch (error) {
        console.log(error);
    }
});
//mostrar citas para manana
router.post('/citasTomorrow',isLoggedIn,async(req,res)=>{
    try {
        const {fechaTomorrow} = req.body;
        const citas = await conexion.query("SELECT * FROM citas WHERE fecha = ?",[fechaTomorrow]);
        res.send(citas);
    } catch (error) {
        console.log(error);
    }
})
//enviar notificaciones por correo
router.post('/enviarNotificacion',isLoggedIn,async(req,res)=>{
    try {
        const {mensaje,remitente,fechaTomorrow} = req.body;
        var correos = [];
        const citas = await conexion.query('SELECT correo FROM citas WHERE fecha = ?',[fechaTomorrow]);
        
        citas.forEach(correo=>{
            correos.push(correo.correo);
        });

         // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
            user: 'cdsoft00@gmail.com', // generated ethereal user
            pass: '19199697tsoCD', // generated ethereal password
            },
        });

        let plantilla = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title></title>
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container">
                                <div class="row">
                                    <div class="col-12 col-md-8 mx-auto">
                                        <div class="card">
                                            <div class="card-header">
                                                <h4 class="card-title text-center">Clinica Odontológica El Redentor</h4>
                                            </div>
                                            <div class="card-body">
                                                <div class="card-text">
                                                    <p>
                                                        ${mensaje}
                                                    </p>
                                                    <p><b>Att:</b> Dr. ${remitente}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>                    
        `;

        let Message = {
            from: '"Centro Odontológico El Redentor" <cdsoft00@gmail.com>', // sender address
            to:correos, // list of receivers
            subject: "Cita ✔", // Subject line
            html: plantilla, // html body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(Message);
       
        res.send('Mensaje Enviado Correctamente');    
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
