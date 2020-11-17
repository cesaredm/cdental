const mysql = require('mysql');
const { promisify } = require('util');
const dbconfig = require('./dbconfig');

//creo la conexion a bd
const conexion = mysql.createPool(dbconfig);


//obtengo la conexion y valido los errores
conexion.getConnection((err, connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error("CONEXION A LA BASE DE DATOS SE CERRO.");
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error(err.code);
        }
    }
    //si no hay error y obtengo la conexion
    if(connection) connection.release();
        console.log("BASE DE DATOS CONECTADA..!");
    
});

//convirtiendo collback en promises
conexion.query = promisify(conexion.query);

//exportamos la conexion 
module.exports = conexion;