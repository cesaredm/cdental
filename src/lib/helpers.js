const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password)=>{
    //generamos el encrypt
    const salt = await bcrypt.genSalt(10);
    //pasamos el password para encriptarlo
    const hash = await bcrypt.hash(password, salt);
    //devuelve el password ecncriptado
    return hash;
}

//para comparar el password
helpers.matchPassword = async (password, savedPassword)=>{
    try {
        //devueleve un true si son iguales y false si no conciden
       return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }
}

helpers.validar = (password, savedPassword)=>{
    if(password === savedPassword){
        return true;
    }
    else{
        return false;
    }
}

module.exports = helpers;
