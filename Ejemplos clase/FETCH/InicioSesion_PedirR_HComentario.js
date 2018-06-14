// FETCH API se usa para hacer peticiones asincronas

function todoOK(respuesta){	//Cuando resolvemos o rechazamos una promesa se envia informacion a veces, por eso suele llevar paramentros.

}

function todoMAL(resrpuesta){

}

function pedirRecetas(){
	let url2 = './rest/receta/?pag=0&lpag=6&t=sal'; 	//T es nombre y elaboracion

	//fetch(url2).then(todoOK,todoMAL);	//El THEN va separado por ','
	fetch(url2).then(function(respuesta) //Esto es lo mismo que arriba
	{
		//Todo ha sido bien
		if(!respuesta.ok){	
			return false;
		}
		
		respuesta.json().then(function(datos){
			console.log(datos); //json
			let html = '';

				//Generamos el html que despues asignaremos al UL del html "Lista-recetas"
				datos.FILAS.forEach(function(elemento/*,indice,vector*/){
					html += `<li>${elemento.nombre}</li>`;
				});

			document.querySelector('#lista-recetas').innerHTML = html;

	    },function(respuesta){
			//La cosa ha ido mal
			console.log('ERROR1');
        });
	});
}



//INICIAR SESION. Esto se hace con FormData de Ajax para enviar informacion mediante peticion POST

function hacerLogin(){
	let url = './rest/login/',
		fd = new FormData(); 	//No le pasamos ningun formulario aqui, pero porque aqui no hay ninguno

	fd.append('login','usuario2');
	fd.append('pwd','usuario2');

	fetch(url,{'method':'POST', 'body':fd}).then(function(respuesta){
		if(!respuesta.ok){
			respuesta.json().then(function(datos){
				console.log(datos);
			});
			return;
		}
		respuesta.json().then(function(datos){
			console.log(datos);
			sessionStorage.setItem('usuario',JSON.stringify(datos));
		});
	},function(respuesta){
		//La cosa ha ido mal
		console.log('ERROR2');
	});
}





function dejarComentario(){
	let url = './rest/receta/1/comentario/',
		fd= new FormData(),
		usu = JSON.parse(sessionStorage.getItem('usuario'));	//Asi es tipo texto. Hay que convertirlo a json
	
	fd.append('l',usu.login);	//l es login
	fd.append('titulo','HOLA CARACOLA');
	fd.append('texto','WIIIIIIIIIIIIIII');

	fetch(url, {'method':'POST','body':fd,'headers':{'Authorization':usu.clave}}).then(function(respuesta){
		if(!respuesta.ok){
			respuesta.json().then(function(datos){
				console.log(datos);	
			});
			return;
		}
		respuesta.json().then(function(datos){
				console.log(datos);	
			});
	},function(respuesta){
		console.log('ERROR3');
	});
}