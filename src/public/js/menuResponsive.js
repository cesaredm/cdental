var contador = 1;
$('#menuBar').click(function(){
	if (contador == 1) {
		$('.menuLateral').animate({
			'left' : '100%'
		});
		contador = 0;
	}else{
		contador = 1;
		$('.menuLateral').animate({
			'left' : '-100%'
		});
	}
	
});