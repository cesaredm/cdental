const express = require('express');
const morgan = require('morgan');
const path = require('path');
const csrf = require('csurf');
const socketIO = require('socket.io');
const conexion = require('./conexion');
const moment = require('moment');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const csrfProteccion = csrf({cookie:true});
const passport = require('passport');
const dbconfig = require('./dbconfig');

//inicializaciones
const app = express();
require('./lib/passport');

//Configuraciones
//puerto
app.set('port', process.env.PORT || 3000);
//decirle al server donde estaran las vistas
app.set('views', path.join(__dirname + "/views"))
//dcirle al server que extencion usaran las vistas
app.engine('html', require('ejs').renderFile);
//decirle al server que motor de plantilla usara
app.set('view engine', 'ejs');

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser('mySecretKey'));
app.use(flash());
//siempre usar session antes de passport
app.use(session({
    secret:'mySecretKey',
    resave:false,
    saveUninitialized:false,
    store: new MySQLStore(dbconfig)
}));
app.use(passport.initialize());
app.use(passport.session());

//variables globales
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//rutas
app.use(require('./routes/index'));

//archivos publicos
app.use(express.static(path.join(__dirname + "/public")));


//server en escucha
const server = app.listen(app.get('port'), (req, res)=>{

});

//configuracion socket.io le pasamos el servidor
const io = socketIO.listen(server);

io.on('connect',async (socket)=>{
    console.log('new connection');
    //socket escuchando
    socket.on('datos:cita',async (datos)=>{
        let nombres = datos.nombres;
        let apellidos = datos.apellidos;
        let telefono = datos.telefono;
        let fecha = datos.fecha;
        let horaInicio = datos.horaInicio;
        let horaFinal = datos.horaFinal;
        let anotaciones = datos.anotaciones;
        let dentista = datos.dentista;
        let correo = datos.correo;
        let estado = datos.estado;
        let data = {nombres,apellidos,telefono,fecha,horaInicio,horaFinal,anotaciones,dentista,correo,estado};
        await conexion.query("INSERT INTO citas set ?", [data]);

        let fechaActual = moment().format('YYYY-MM-DD');
        const citas = await conexion.query(`SELECT c.id,c.nombres,c.apellidos,telefono,fecha,horaInicio,horaFinal,anotaciones,correo,d.nombres as nombresDentista,
                                            d.apellidos as apellidosDentista,color FROM citas AS c LEFT JOIN dentistas as d on(c.dentista=d.id) ORDER BY id DESC LIMIT 1`);//conexion.query("SELECT * FROM citas WHERE fecha = ? ORDER BY horaInicio", [fechaActual]);
        //socket emitiendo
        io.sockets.emit('cita:guardada',{
            citas
        });
        //conexion.end();
    })

    //editar cita
    socket.on('cita:update',async(datos)=>{
        const {id, nombres, apellidos, telefono, fecha, horaInicio, horaFinal, anotaciones,correo,dentista} = datos;
        try {
            await conexion.query("UPDATE citas SET nombres = ?, apellidos = ?, telefono = ?, fecha = ?, horaInicio = ?, horaFinal = ?, anotaciones = ?, dentista = ?, correo = ? WHERE id = ?", [nombres, apellidos, telefono, fecha, horaInicio, horaFinal, anotaciones, dentista, correo, id]);
            let fechaActual = moment().format('YYYY-MM-DD');
            //obtener el dentista de la cita a actualizar
            const doctorCita = await conexion.query("SELECT d.nombres,d.apellidos,d.color from dentistas as d inner join citas as c on(d.id=c.dentista) where c.id = ?",[id]);
            //envio las citas y los datos recividos de la vista
            io.sockets.emit('cita:update',{
                datos,
                doctorCita
            });
        } catch (error) {
            console.log(error);
        }
    });

    //actualizar estado de cita
    socket.on('update:estado',async(id)=>{
        await conexion.query('UPDATE citas SET estado = "terminado" WHERE id = ?',[id.id]);
        io.sockets.emit('update:estado',{message:'listo'});
    });

    //borrar cita
    socket.on('delete:cita',async (id)=>{
        try {
            await conexion.query("DELETE FROM citas WHERE id = ?",[id.id]);
            let fechaActual = moment().format('YYYY-MM-DD');
            const citas = await conexion.query("SELECT * FROM citas WHERE fecha = ? ORDER BY horaInicio",[fechaActual]);
            io.sockets.emit('delete:cita',{
                id:id.id,
                citas
            });
        } catch (error) {
            console.log(error);
        }
    });
});