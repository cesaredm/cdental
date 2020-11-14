alerta();
function alerta() {
  var text = document.querySelector(".alerta-login").getAttribute('id');
  console.log(text);
  if (text === "") {
    
  } else {
    document.querySelector(".alerta-login").style.display = "block";
  }
}
