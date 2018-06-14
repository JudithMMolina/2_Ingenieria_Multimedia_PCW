//OBJETO

var promesa = new Promise(function(resolve,reject){
	let xhr = new XMLHttpRequest(),
		url = './rest/receta/?pag=0&lpag=6';

	xhr.open('GET',url, true);
	xhr.onload = function(){
		resolve(xhr.responseText);
	}
	xhr.onerror = function(){
		reject('ERROR EN LA PETICION');
	}
	xhr.send();
});



function lanzarPromesa(){
	promesa.then(function(datos){
		//Todo bien
		console.log('Desde la promesa')
		console.log(datos);
	},function(msjError){
		//Se ha producido un error
		console.log(msjError);
	});
}




function peticionAJAX(){
	let xhr = new XMLHttpRequest(),
		url = './rest/receta/?pag=0&lpag=6';

	xhr.open('GET',url, true);
	xhr.onload = function(){
		console.log('Desde la AJAX')
		console.log(xhr.responseText);
	}
	xhr.send();
}



function miFETCH(url,init){
	return new Promise(function(resolve,reject){
		let xhr = new XMLHttpRequest(),
			url = './rest/receta/?pag=0&lpag=6';

		xhr.open('GET',url, true);
		xhr.onload = function(){
			resolve(xhr.responseText);
		}
		xhr.onerror = function(){
			reject('ERROR EN LA PETICION');
		}
		xhr.send();
	})
}


function lanzarMiFETCH(){
	miFETCH('./rest/receta/?pag=0&lpag=6').then(function(datos){
		//Todo bien
		console.log('Desde FETCH')
		console.log(datos);
	},function(msjError){
		//Se ha producido un error
		console.log(msjError);
	});
}