router(window.location.hash);
window.addEventListener('hashchange', () => {
    router(window.location.hash);
});

function router(rutas) {
    switch (rutas) {
        case '#/':
            {
                $('#citas').show(250);
                $('#diagnostico').hide(250);
                $('#adminUsers').hide(250);
                $('#dentistas').hide(250);
                $('#notificaciones').hide(250);
            }
            break;
        case '#/diagnostico':
            {
                $('#diagnostico').show(250);
                $('#citas').hide(250);
                $('#adminUsers').hide(250);
                $('#dentistas').hide(250);
                $('#notificaciones').hide(250);
            }
            break;
        case '#/usuarios':
            {
                $('#adminUsers').show(250);
                $('#diagnostico').hide(250);
                $('#citas').hide(250);
                $('#dentistas').hide(250);
                $('#notificaciones').hide(250);
            }
            break;
        case '#/dentistas':{
            $('#dentistas').show(250);
            $('#adminUsers').hide(250);
            $('#diagnostico').hide(250);
            $('#citas').hide(250);
            $('#notificaciones').hide(250);
        }
        break;
        case '#/notificaciones':{
            $('#notificaciones').show(250);
            $('#dentistas').hide(250);
            $('#adminUsers').hide(250);
            $('#diagnostico').hide(250);
            $('#citas').hide(250);
        }
        break;
        default:
            break;
    }
}

//funcion active del menu lateral
$('nav ul li').click(function(){
    $(this).addClass("active").siblings().removeClass("active");
});