// Variables globales usadas para el desarrollo de la práctica

var pagina = 1;
var paginaF = 1;
var foto = 0;
var fotoMax = 0;
var recetaActual = 0;
var mensaje = 0;
var disponible = 0;
var ingredientesT = 0;
var Cfichas = 0;
var maxPeso = 300;
var disponible = false;
var Cfotos = 0;




// TODOS

//---------------------------------------------------------------------
//Cerrar sesion y limpiar SessionStorage
	function CerrarSesion(b,num){
		var datos = sessionStorage.key('usuario');
		if(datos != null){
			sessionStorage.clear();
			document.getElementById('cerrarses').innerHTML = '';
			document.getElementById('iniciarses').innerHTML = '<a href="login.html"><span class="icon-login"></span><span> Login</span></a>';
			document.getElementById('registro').innerHTML = '<a href="registro.html"><span class="icon-user-plus"></span> <span>Registro</span></a>';
			document.getElementById('nuevare').innerHTML = '';
		
			if(b){
				document.getElementById('voto').innerHTML = '';
				document.getElementById('escribir').innerHTML = '';
				document.getElementById('escribir').innerHTML = '<p>Para escribir un comentario tienes que estar <a href="login.html">logeado</a>.</p>';
			}

			if(num == 1){
				location.href= "index.html"
			}
		}
		return false;
	}




//---------------------------------------------------------------------
//Realiza las busquedas de receta para el INDEX y BUSCAR
//URL que se le pasa, numero es la pagina(pero +1), id es donde debe escribirlo
	function PonerRecetasBusqueda(url,numero,id,cogelo){

		var inicio = './rest/receta/?pag='+(numero-1)+'&lpag=6';
		
		//Si no entra significaría que no se ha hecho ninguna busqueda
		if (url != '') {
			if(cogelo){
				//la url pasada no tiene incorporada la paginación (index.html)
				inicio += '&'+url;
				console.log('Inicio1'+inicio);
			}
			else{
				//la url pasada tiene la paginación y no hay que incluirla (buscar.html)
				inicio += url.substring(12);
				console.log('Inicio2'+inicio);
			}
		}

		//Fetch para la busqueda de las recetas
		fetch(inicio).then(function(respuesta){
			if(!respuesta.ok){
				console.log('Esos datos no estan en la base de datos');
			}
			else{
				respuesta.json().then(function(datos){
					console.log(datos);
					//Calculo de los números de la paginación
					paginaF = Math.ceil(datos.TOTAL_COINCIDENCIAS / 6);
					let html = '';

					//Generamos el html que despues asignaremos al UL del html "Lista-recetas"

					let final = 'P&aacute;gina actual: '+pagina+' de '+paginaF;
					document.querySelector('#PaginaActual').innerHTML = final;

					//Si no se han devuelto filas, no hay recetas. Lo dejamos en blanco todo
					if(datos.FILAS.length == 0){
						document.querySelector(id).innerHTML = '';
						document.querySelector('#final').innerHTML = '';
					}
					else{
						//Ponemos cada receta
						datos.FILAS.forEach(function(elemento){
							html += `<article>
										<h3>
											<a href="receta.html?${elemento.id}" >${elemento.nombre}</a>
										</h3>
										<h4>By: <a href="buscar.html?pag=0&lpag=6&a=${elemento.autor}">${elemento.autor}</a>, <time>${elemento.fecha}</time></h4>
										<img src="fotos/${elemento.fichero}"  alt="No se ha podido cargar la imagen">
										<footer>
											<p class="icon-comment">${elemento.comentarios}</p><p class="icon-thumbs-up">${elemento.positivos}</p><p class="icon-thumbs-down">${elemento.negativos}</p>
										</footer>
									</article>`;
							document.querySelector(id).innerHTML = html;
						});
					}
					
				})	
			};

		},function(respuesta){
			//La cosa ha ido mal
			console.log('No se han podido recuperar. ¿Estas en LOCALHOST?');
		});
	}




//---------------------------------------------------------------------------------
	//Mostrar todo aquello que depende del inicio de sesión. B sirve para receta.html
	//num = Si no está iniciado sesión, es posible que te redirijan a INDEX (nueva-receta)
	function MostrarDatosSesion(b,num){
		var datos = sessionStorage.key('usuario');

		//Cambiamos el menú
		if(datos != null){
			document.getElementById('registro').innerHTML = '';
			document.getElementById('nuevare').innerHTML = '<a href="nueva-receta.html"><span class="icon-plus"></span><span>Nueva receta</span></a>';
			document.getElementById('cerrarses').innerHTML = '<a  href=""><span class="icon-logout"></span><span>Logout</span></a>';
			document.getElementById('iniciarses').innerHTML = '';
			
			//Aparecen los botones de votar y se coge el formulario de los comentarios
			if(b){
				document.getElementById('voto').innerHTML = `<button id="pos" class="icon-thumbs-up" onclick="Voto(1);">Me gusta</button>
																<button id="neg" class="icon-thumbs-down" onclick="Voto(0);">No me gusta</button>`;

				//CAMBIAR
				document.getElementById('escribir').innerHTML = '';
			
					fetch('formulario.html').then(function(respuesta){
						if(!respuesta.ok){
							console.log('Esos datos no estan en la base de datos');
						}
						else{
							respuesta.text().then(function(datos){
								console.log(datos);
								document.getElementById('escribir').innerHTML = datos;
							});
						};

					},function(respuesta){
						//La cosa ha ido mal
						console.log('No se han podido recuperar. ¿Estas en LOCALHOST?');
					});

			}
		}
		//En el caso de nueva receta, si no estás logueado, rediriges
		else if(num == 1){
			location.href = 'index.html';
		}
	}



// Mensajeeeeeeeeeee
function Mensaje (h2, msj, color, err, dir, fcus){
		/*
			h2 -> título del mensaje
			msj -> contenido del mensaje
			color -> color del mensaje (#XXX / #XXXXXX)
			err -> true si se ha producido un error, false si está todo correcto
			dir -> si se produce el error, dir DEBE ser ''. Si no hay error, dir contiene la página de redirección
			fcus -> donde debe centrarse el foco en caso de error
		*/
		//vacia de nuevo el P del error para que luego vuelva a aparecer
		var translucido = document.createElement("DIV");

		translucido.id = 'translucido';
		translucido.style.position = 'fixed';
		translucido.style.width = '100%';
		translucido.style.height = '100%';
		translucido.style.margin = '0';
		translucido.style.top = '0';
		translucido.style.left = '0';
		translucido.style.background = '#FFF';
		translucido.style.opacity = '0.8';
		translucido.style.zIndex = '1';

		var caja = document.createElement("DIV");

		caja.id = 'caja';
		caja.style.position = 'fixed';
		caja.style.width = '32%';
		caja.style.left = '50%';
		caja.style.top = '8em';
		caja.style.background = '#eee';
		caja.style.border = '2px solid black';
		caja.style.transform = 'translate(-50%)';
		caja.style.zIndex = '2';

		var titulo = document.createElement("H2");
		var nodoTitulo = document.createTextNode(h2);
		titulo.appendChild(nodoTitulo);

		titulo.style.textAlign = 'center';
		titulo.style.background = color;
		titulo.style.margin = '0';
		titulo.style.padding = '1em';
		titulo.style.fontSize = '2em';

		var contenido = document.createElement("P");
		var nodoContenido = document.createTextNode(msj);
		contenido.appendChild(nodoContenido);

		contenido.style.textAlign = 'center';
		contenido.style.padding = '1.5em';
		contenido.style.maxWidth = '100em';

		var boton = document.createElement("BUTTON");
		var nodoBoton = document.createTextNode("Aceptar");
		boton.appendChild(nodoBoton);

		boton.id = 'aceptar';
		
		boton.style.display = 'block';
		boton.style.margin = 'auto';
		boton.style.marginBottom = '1.5em';
		
		boton.onclick = function() {
			if(err == true){
				var caja = document.getElementById('caja');
				document.body.removeChild(caja);
				var translucido = document.getElementById('translucido');
				document.body.removeChild(translucido);
				if(fcus != '')
					document.getElementById(fcus).focus();
			} else {
				if(dir != '')
					location.href = dir;
				else
					var caja = document.getElementById('caja');
					document.body.removeChild(caja);
					var translucido = document.getElementById('translucido');
					document.body.removeChild(translucido);
			}
		}

		caja.appendChild(titulo);
		caja.appendChild(contenido);
		caja.appendChild(boton);

		document.body.appendChild(translucido);
		document.body.appendChild(caja);

		boton.focus(); // el focus hay que hacerlo DESPUÉS de añadir el boton al documento
	}






//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------


// INDEX


// Se ejecuta al abrir el INDEX.HTML
	function Cargando(){
		PonerRecetasBusqueda('',pagina,'#recetas',false);
		//No tenemos que sacar cosas de los votos ni redirigir
		MostrarDatosSesion(false,0);
		return false;
	}




//------------------------------------------------------------------------------------------------------------
// Nos da las recetas de la pagina anterior
	function Anterior(){

		var url = window.location.search;
		url= url.substring(1);

		if(pagina>1){
			pagina--;
			PonerRecetasBusqueda(url,pagina,'#recetas',false);
		}

	} //Anterior()


//------------------------------------------------------------------------------------------------------------
// Nos da las recetas de la siguiente pagina
	function Siguiente(){

		var url = window.location.search;
		console.log(url);
		url = url.substring(1);

		if(pagina<paginaF){
			pagina++;
			console.log(pagina);
			PonerRecetasBusqueda(url,pagina,'#recetas',false)
		}
			
	} //Siguiente




//------------------------------------------------------------------------------------------------------------
// Nos da las recetas de la primera pagina
	function Primera(){

		var url = window.location.search;
		url = url.substring(1);

		if(pagina != 1){
			pagina = 1;
			PonerRecetasBusqueda(url,pagina,'#recetas',false);
		}

	} //Primera()


//------------------------------------------------------------------------------------------------------------
// Nos da las recetas de la ultima pagina
	function Ultima(){

		var url = window.location.search;
		url = url.substring(1);

		if(pagina != paginaF){
			pagina = paginaF;
			PonerRecetasBusqueda(url,pagina,'#recetas',false);
		}

	} //Ultima()






//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------


// LOGIN

// ¿Estamos logueados? Entonces redirigimos
	function Comprobar(){
		//Obtiene la informacion almacenada del sessionStorage
		var data = sessionStorage.key('usuario');
		if(data!=null){
			location.href='index.html';
		}
	}



// Iniciamos Sesion
	function IniciarSesion(){
		
		let url = './rest/login/';
		let frm = document.querySelectorAll("form")[0];
		let fd = new FormData(frm); 	

		//Llamada FETCH para saber si el usuario está en la base de datos
		fetch(url,{'method':'POST', 'body':fd}).then(function(respuesta){
			if(!respuesta.ok){
				console.log('Esos datos no estan en la base de datos');
				//Mensaje
				Mensaje('Error', 'Usuario o contraseña incorrectos', '#fbb', true, '', 'Usuario');
			}
			else{
				respuesta.json().then(function(datos){
					console.log(datos);
					sessionStorage.setItem('usuario',JSON.stringify(datos));
					//Mensaje
					Mensaje('Éxito', 'Te has logeado correctamente', '#bfb', false, 'index.html', '');
				})	
			};

		},function(respuesta){
			//La cosa ha ido mal
			console.log('Recuerda entrar desde el LOCALHOST');
		});

		return false;
	}


	




//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------


// REGISTRO

//Si estás iniciado sesión redirigimos
function CargarRegistro(){
	var datos = sessionStorage.key('usuario');
	if(datos != null){
		location.href="index.html";
	}
	disponible = false;
}


//------------------------------------------------------------------------------------------------------------
//Miramos si el nombreque estamos escribiendo es válido y mostramos un icono u otro según la respuesta
function ComprobarDisponibilidad(){

	let url = './rest/login/';
	var frm = document.querySelectorAll("form")[0];
	
	disponible = false;
	url += frm.login.value;

	if(frm.login.value != ''){
		fetch(url).then(function(respuesta){
			if(!respuesta.ok){
				console.log('-');
			}
			else{
				respuesta.json().then(function(datos){
				
					//Mostramos
					if(datos.DISPONIBLE == true&&frm.login.value.length>=6){
						let html = '<p class="icon-ok"></p>'
						document.getElementById('mensajito2').innerHTML = '';
						document.getElementById('mensajito1').innerHTML = html;
						disponible = true;
					}
					else{
						let html = '<p class="icon-cancel"></p>'
						document.getElementById('mensajito1').innerHTML = '';
						document.getElementById('mensajito2').innerHTML = html;
						disponible = false;
						
					}
					
					
				})	
			};

		},function(respuesta){
			//La cosa ha ido mal
			console.log('Recuerda entrar desde el LOCALHOST');
		});
	}
	else{
		let html = '<p class="icon-cancel"></p>'
		document.getElementById('mensajito1').innerHTML = '';
		document.getElementById('mensajito2').innerHTML = html;
	}

}


//------------------------------------------------------------------------------------------------------------
//Esto es usa para comprobar que todos los campos están rellenados
function ComprobarDatos(frm){

	var fd = new FormData(frm);
	var url = './rest/usuario/';

	if(disponible){
		//¿Las contraseñas son iguales?
		if(frm.pwd.value == frm.pwd2.value){
			let html = '<p class="icon-ok"></p>'
			//Mostramos los iconos correspondientes
			document.getElementById('mensajito4').innerHTML = '';
			document.getElementById('mensajito6').innerHTML = '';
			document.getElementById('mensajito3').innerHTML = '';
			document.getElementById('mensajito3').innerHTML = html;
			document.getElementById('mensajito5').innerHTML = '';
			document.getElementById('mensajito5').innerHTML = html;

			//Intentamos registrarnos
			fetch(url, {'method':'POST', 'body':fd}).then(function(respuesta){
				if(!respuesta.ok){
					console.log('No te has podido registrar');
					Mensaje('Error', 'Ha ocurrido un error al completar el registro', '#fbb', true, '', 'Usuario');
				}
				else{
					respuesta.text().then(function(datos){
						console.log(datos);
						console.log('Te has registrado correctamente');	
					});
				};

			},function(respuesta){
				//La cosa ha ido mal
				console.log('No se han podido recuperar. ¿Estas en LOCALHOST?');
			});

			document.getElementById('registrof').reset();
			//MENSAJE
			Mensaje('Éxito', 'Te has registrado correctamente', '#bfb', false, 'login.html', '');

		}
		else{
			//Mostramos los iconos en rojo
			let html = '<p class="icon-cancel"></p>'
			document.getElementById('mensajito3').innerHTML = '';
			document.getElementById('mensajito4').innerHTML = '';
			document.getElementById('mensajito4').innerHTML = '';
			document.getElementById('mensajito4').innerHTML = html;
			document.getElementById('mensajito6').innerHTML = '';
			document.getElementById('mensajito6').innerHTML = html;
			//MENSAJE DE CONTRASEÑAS DIFERENTES
			Mensaje('Error', 'Las contraseñas no coinciden', '#fbb', true, '', 'Contr1');
			
		}
	}
	else{
		//MENSAJE DE NOMBRE DE LOGIN
		Mensaje('Error', 'Ese nombre de usuario no está disponible', '#fbb', true, '', 'Usuario');

	}
	return false;
}








//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------


// BUSCAR

//Cuando cargue la pagina cogemos la url y llamamos a Buscar receta.
	function CargarBusqueda(){
		
		var url1 = window.location.search;
		pagina = 1;
		MostrarDatosSesion(false,0);

		if(url1 != ''){
			url1 = url1.substring(1);	//Quitamos la interrogacion
			PonerRecetasBusqueda(url1,pagina,'#recetas',false);
		}
		else{
			PonerRecetasBusqueda('',pagina,'#recetas',false);
		}

		return false;
	}



//---------------------------------------------------------------------------------------------------------------
//Buscando desde el Index. Redirigimos a la pagina de buscar con el texto puesto
	function Buscando(frm){
		let nuevo = frm.buscador.value; 
		location.href = 'buscar.html?pag='+pagina+'&lpag=6&t='+nuevo;
		return false;
	}

//---------------------------------------------------------------------------------------------------------------
//Filtrando todo
	function Filtrando(frm){
		var url = '';
		
		if(frm.nombre.value != ''){
			url += '&n='+frm.nombre.value;
		}

		if(frm.ingredientes.value != ''){
			url += '&i='+frm.ingredientes.value
		}

		if(frm.tiempo2.value != 0){
			url += '&di='+frm.tiempo1.value+'&df='+frm.tiempo2.value;
		}

		if(frm.dificultad.value != 0){
			url += '&d='+(frm.dificultad.value -1);
		}

		if(frm.numComensales.value != 0){
			url += '&c='+frm.numComensales.value;
		}

		if (frm.autor.value) {
			url += '&a='+frm.autor.value;
		}
		pagina = 1;
		location.href = 'buscar.html?pag=0&lpag=6'+url;
		
		return false;
	}




//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------



//RECETA


	function RecetaCarga(){
		//Tenemos que mirar la url, porque si no hay ID, se redirige. Además, esta ID se necesita
		var url1 = window.location.search;
		var url2 = 'rest/receta/';
		//Esto está para quitar la ?
		url1 = url1.substring(1);
		recetaActual = url1;

		//Tiene que tener longitud
		if(url1.length > 0){
			url2 += url1;
			console.log(url1);
			var url3 = url2+'/ingredientes';
			var url4 = url2+'/comentarios';
			var url5 = url2+'/fotos';
			MostrarDatosSesion(true,0);
			//Hacemos todas las llamadas necesarias
			InfoReceta(url2,1);
			InfoReceta(url3,2);
			InfoReceta(url4,3);
			InfoReceta(url5,4);
		}
		else{
			location.href = "index.html";
		}
		
		
		return false;
	}


//---------------------------------------------------------------------------------------------------------------
	//Realiza las busquedas la informacion de la receta, segun el numero mandado, ya que la url es distinta
	function InfoReceta(url,numero){

		console.log(url);
		let html1 = '';
		let html2 = '';
		let html3 = '';
		let html4 = '';
		let html5 = '';
		let html6 = '';
		let html7 = '';

		fetch(url).then(function(respuesta){
			if(!respuesta.ok){
				console.log('Esos datos no estan en la base de datos');
				
			}
			else{
				respuesta.json().then(function(datos){
					console.log(datos);
					
					
					if(datos.FILAS.length > 0){
						datos.FILAS.forEach(function(elemento){
							
							//Esto está para la información general
							if(numero == 1){
								html1 = `<p>${elemento.elaboracion}</p>`;
								document.querySelector('#elaboracion2').innerHTML = html1;

								html2 = `	<a href="#comentarios" id="comment"><p class="icon-comment"> ${elemento.comentarios}</p></a>
											<p id="positivo" class="icon-thumbs-up">${elemento.positivos}</p>
											<p id="negativo" class="icon-thumbs-down"> ${elemento.negativos}</p>`;
								document.querySelector('#iconos').innerHTML = html2;

								html3 = `	<p id="r1"><b>Autor:</b>&nbsp;<a href="buscar.html?pag=0&lpag=6&a=${elemento.autor}">${elemento.autor}</a></p>
											<p id="r2" class="icon-calendar"><time>${elemento.fecha}</time></p>
											<p id="r3" class="icon-clock">${elemento.tiempo} minutos</p>
											<p id="r4"><b>Dificultad:</b>&nbsp;${elemento.dificultad}</p>
											<p id="r5" class="icon-restaurant">${elemento.comensales}</p>`;
								document.querySelector('#datos').innerHTML = html3;

								html4 = `	${elemento.nombre}`;
								document.querySelector('#titulo').innerHTML = html4;
							}

							//Esta está para los ingredientes
							else if (numero == 2){
								html5 = html5 + `<li>${elemento.nombre}</li>`;
								document.querySelector('#ingredientes').innerHTML = html5;
							}

							//Comentarios
							else if (numero == 3){
								html6 = html6 + `<article>
													<h2>&nbsp;</h2>
													<p><b>${elemento.autor},&nbsp;</b><i><time datetime="2018-02-12">${elemento.fecha}</time></p></i></p>
													<div>
														<p><b>${elemento.titulo}</b></p>
														<p>${elemento.texto}</p>
													</div>
												</article>`;
								document.querySelector('#comentarios').innerHTML = html6;
							}
					
						});

						//Esta está para sacar las fotos. Solo mostramos la primera
						if (numero == 4){
							foto = 0;
							fotoF = datos.FILAS.length;
							console.log (foto+ ' de ' +fotoF);
							html7 = `<img src="fotos/${datos.FILAS[foto].fichero}" alt="Lasaña" id="receta1">`;
							document.querySelector('#foto').innerHTML = html7;
							html7 = `<label class="icon-left-circled" onclick="AnteriorFoto();"></label>
									<p>${datos.FILAS[foto].texto}</p>
									<label class="icon-right-circled" onclick="SiguienteFoto();"></label>`;
							document.querySelector('#fotos').innerHTML = html7;
						}
					}
					else{
						console.log('aaaaaaaa');
					}

				})	
			};

		},function(respuesta){
			//La cosa ha ido mal
			console.log('No se han podido recuperar. ¿Estas en LOCALHOST?');
		});

		
	}



//---------------------------------------------------------------------------------------------------------------
	//Siguiente Foto
	function SiguienteFoto(){
		if(foto<(fotoF-1)){
			foto++;
			CambioFoto('./rest/receta/'+recetaActual+'/fotos');
		}
	}


//---------------------------------------------------------------------------------------------------------------
	//Anterior Foto
	function AnteriorFoto(){
		if(foto>0){
			foto--;
			CambioFoto('./rest/receta/'+recetaActual+'/fotos');
		}
	}


//---------------------------------------------------------------------------------------------------------------
	//Cambio de fotos
	function CambioFoto(url){

		var html = '';
		
		fetch(url).then(function(respuesta){
			if(!respuesta.ok){
				console.log('Esos datos no estan en la base de datos');
			}
			else{
				respuesta.json().then(function(datos){
					console.log(datos);
					
					html = `<img src="fotos/${datos.FILAS[foto].fichero}" alt="Lasaña" id="receta1">`;
					document.querySelector('#foto').innerHTML = html;
					html = `<label class="icon-left-circled" onclick="AnteriorFoto();"></label>
								<p>${datos.FILAS[foto].texto}</p>
							<label class="icon-right-circled" onclick="SiguienteFoto();"></label>`;
					document.querySelector('#fotos').innerHTML = html;
				})	
			};

		},function(respuesta){
			//La cosa ha ido mal
			console.log('No se han podido recuperar. ¿Estas en LOCALHOST?');
		});
	}


//---------------------------------------------------------------------------------------------------------------
//Emitir VOTO. Segun el numero es positivo o negativo
	function Voto(num){

		let url = './rest/receta/'+recetaActual+'/voto/'+num;
		let usu = JSON.parse(sessionStorage.getItem('usuario'));
		let fd= new FormData();
		console.log(url);

		fd.append('l',usu.login);	//autorReceta tiene el nombre del autor de la receta en la que estoy actualmente

		fetch(url,{'method':'POST', 'body':fd,'headers':{'Authorization':usu.clave}}).then(function(respuesta){
			if(!respuesta.ok){
				console.log('No tienes autorizacion para votar');

			}
			else{
				respuesta.json().then(function(datos){
					console.log(datos);
					console.log('Has votado con exito');
					var url1 = window.location.search;
					var url2 = 'rest/receta/';
					url1 = url1.substring(1);
					url2 += url1;
					InfoReceta(url2,1);
					//MENSAJE DE VOTO CON EXITO
					Mensaje('Éxito', 'Voto recogido correctamente', '#bfb', false, '', '');
				})	
			};

		},function(respuesta){
			//La cosa ha ido mal
			console.log('Recuerda entrar desde el LOCALHOST');
		});

	}




//---------------------------------------------------------------------------------------------------------------
//Enviar un comentario
function EnviarComentario(frm){

	let url = './rest/receta/'+recetaActual+'/comentario';
	let usu = JSON.parse(sessionStorage.getItem('usuario'));
	let fd= new FormData();
	console.log(url);

	fd.append('l',usu.login);	//autorReceta tiene el nombre del autor de la receta en la que estoy actualmente
	fd.append('titulo',document.querySelectorAll("form")[0].titulo.value);
	fd.append('texto',document.querySelectorAll("form")[0].texto.value);

	fetch(url,{'method':'POST', 'body':fd,'headers':{'Authorization':usu.clave}}).then(function(respuesta){
		if(!respuesta.ok){
			console.log('No tienes autorizacion para comentar');
			Mensaje('Error', 'Ha ocurrido un error al recoger el comentario', '#fdd', true, '', 'title');
		}
		else{
			respuesta.json().then(function(datos){
				console.log(datos);
				console.log('Has comentado');
				var url1 = window.location.search;
				console.log(url1);
				var url2 = 'rest/receta/';
				url1 = url1.substring(1);
				url2 += url1;
				var url4 = url2+'/comentarios';
				InfoReceta(url4,3);
				Mensaje('Éxito', 'Se ha recogido tu comentario satisfactoriamente :v', '#dfd', false, '', '');
				document.getElementById('formularioComentario').reset();
			})	
		};

	},function(respuesta){
		//La cosa ha ido mal
		console.log('Recuerda entrar desde el LOCALHOST');
	});
	return false;

}	







//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------



//NUEVA-RECETA

//¿Estás iniciado sesión?
function NRCarga(){
	MostrarDatosSesion(false,1);
	ingredientesT = 0;
}



//Esta función se encarga de meter los ingredientes en la lista
	function Ingredientes(){
		var input = document.querySelector("form")[7];
		var lista = document.getElementById('Insertando');

		if(input.value != ''){
			if(ingredientesT != 0){
				document.getElementById('Insertando').innerHTML += `<li name="i">`+input.value+`</li>`;
				document.getElementById('anadir').value = '';
			}
			else{
				document.getElementById('Insertando').innerHTML =  `<li name="i">`+input.value+`</li>`;
				ingredientesT++;
				document.getElementById('anadir').value = '';
			}
		}
		return false;
	}



//---------------------------------------------------------------------------------------------------------------
//Esta función se encarga de añadir fichas de fotos
	function FotoN(){
		Cfichas++;
		var div = document.createElement("DIV");
		div.class="ficha-foto";
		div.innerHTML += `<br>
							<footer>
								<input type="file" accept="image/*" name="foto" onchange="cargarImagen(this);">
								<button class="icon-cancel" onclick="EliminarFicha(this);"></button>
							</footer>
							<div onclick="parentNode.querySelector('[type=file]').click();">
								<img id="i${Cfichas}" src="Imagenes/no.png" alt="No hay imagen" title="Pincha para elegir/cambiar foto">
							</div>
							<textarea placeholder="descripción de la foto" required></textarea>
						<br>`

		document.getElementById('Imagenes').appendChild(div);

		return false;
	}


//---------------------------------------------------------------------------------------------------------------
//Esta funcion se encarga de eliminar una ficha de foto
	function EliminarFicha(ficha){

		if(Cfotos==Cfichas){
			Cfotos--;
		}
		Cfichas--;
		var padre = ficha.parentNode.parentNode;
		padre.remove();

		return false;
	}



//---------------------------------------------------------------------------------------------------------------
//Funcion que cambia la imagen cuando se produce un cambio en el INPUT file de la fotografía a mostrar
	function cargarImagen(ruta){

		console.log(ruta);
		console.log(ruta.files);

		//Primero validamos que el peso sea el correcto. Si no lo es, mostramos un mensaje modal y no cargamos la imagen.
		if(ruta.files[0].size / 1000 > maxPeso){
			Mensaje('Error', 'El tamaño de la foto supera el tamaño máximo permitido (' + maxPeso + ' kB)', '#fbb', true, '', '');
			ruta.parentNode.parentNode.querySelector('img').src = './Imagenes/no.png';
			ruta.value = '';
			return false;
		}

		//Si lo es. Abrimos un objeto FILE que nos ayudara a leer la imagen con la funcion de abajo
		let fr = new FileReader();

		fr.onload = function(){
			let imagen = new Image();

			imagen.onload = function(){
				document.getElementById(ruta)
				ruta.parentNode.parentNode.querySelector('img').src=imagen.src;
			}
			imagen.src = fr.result;
		}
		fr.readAsDataURL(ruta.files[0]);
		Cfotos++;

	}



//---------------------------------------------------------------------------------------------------------------
//Esta función valida que todo sea correcto a la hora de subir la receta
	function Publicando(){

		var url = './rest/receta/';
		if(ingredientesT != 0){
			if(Cfichas !=0){
				//La cantidad de fotos tiene que ser igual a la cantidad de fichas
				if(Cfichas == Cfotos){
					SubirReceta(url);
				}
				else{
					Mensaje('Error', 'No has seleccionado una foto para subir en alguna de las fichas', '#fbb', true, '', '');
				}
			}
			//Tiene que haber una ficha con foto
			else{
				//Mensaje modal
				Mensaje('Error', 'Debes subir una foto como mínimo', '#fbb', true, '', '');
			}
		}
		//Tiene que haber ingredientes
		else{
			//Mensaje modal DEBES AL MENOS PONER UNA FOTO
			Mensaje('Error', 'PON INGREDIENTES JODER', '#fbb', true, '', '');
		}
		return false;
	}


//---------------------------------------------------------------------------------------------------------------
//Llamada FETCH para subir la receta
	function SubirReceta(url){

		//Llamada FETCH para crear la receta
		//Tiene que ser el usuario y la clave del que está logueado
		let usu = JSON.parse(sessionStorage.getItem('usuario'));
		let fd= new FormData();

		fd.append('l',usu.login);	
		//Metemos todos los valores necesarios
		fd.append('n',document.querySelectorAll("form")[0].n.value);
		fd.append('e',document.querySelectorAll("form")[0].e.value);
		fd.append('t',document.querySelectorAll("form")[0].t.value);

			//Asi miramos que radiobutton esta seleccionado
			var formulario = document.querySelectorAll("form")[0];
			for ( var i = 0; i< formulario.d.length; i++){
				if(formulario.d[i].checked){
					break;
				}
			}

			//Dificultad
			if(formulario.d[i].value == 'baja'){
				fd.append('d', 0);
			}
			else if (formulario.d[i].value == 'media'){
				fd.append('d', 1);
			}
			else if (formulario.d[i].value == 'alta'){
				fd.append('d', 2);
			}

		fd.append('c', document.querySelectorAll("form")[0].c.value);

		fetch(url,{'method':'POST', 'body':fd,'headers':{'Authorization':usu.clave}}).then(function(respuesta){
			if(!respuesta.ok){
				console.log('No has podido subir la receta');
				//Mensaje modal
				Mensaje('Error', 'Se ha producido un error al subir la PUTA RECETA', '#fbb', true, '', '');
			}
			else{
				respuesta.json().then(function(datos){
					console.log(datos);
					console.log('Has subido la receta');
					let porno = document.querySelectorAll("form")[0].n.value;
					SubirIngredientes(url,datos.ID, porno);
					
				})	
			};
		},function(respuesta){
			console.log('Recuerda entrar desde el LOCALHOST');
		});
		return false;
	}



//Llamada FETCH para subir ingredientes y las fotos. Porno = nombre receta
	function SubirIngredientes(url,id, porno){

		let ultima = false;
		url += id;
		url += '/ingredientes';

		var lista = document.getElementById('Insertando');
		console.log(lista);
		//Creamos un array
		var array = new Array();
		for(var i = 0;i<lista.children.length;i++){
			//Con INNERHTML tambien accedes al texto que hay dentro de un objeto
			//Metemos cada uno de los ingredientes
			array.push(lista.children[i].innerHTML) ;
		}
		
		//Transformamos el array a JSON
		array = JSON.stringify(array);

		let usu = JSON.parse(sessionStorage.getItem('usuario'));
		let fd= new FormData();

		fd.append('l',usu.login);	//autorReceta tiene el nombre del autor de la receta en la que estoy actualmente
		fd.append('i',array);
		fetch(url,{'method':'POST', 'body':fd,'headers':{'Authorization':usu.clave}}).then(function(respuesta){
			if(!respuesta.ok){
				console.log('No has podido subir los ingredientes');
				//Mensaje modal

			}
			else{
				respuesta.json().then(function(datos){
					console.log(datos);
					console.log('Has subido los ingredientes');
					//Ahora que hemos terminado de subir los ingredientes subimos las fotos una por una
					//Guardando imagenes
					for( var j = 1 ; j<=Cfichas;j++){
						//Acecemos al input file
						let img = document.getElementById('i'+j);
						let textarea = img.parentNode.parentNode.querySelector('textarea');
						let archivito = img.parentNode.parentNode.querySelector('input');
						console.log(archivito);
						//Cuando entra es porque estamos en la ultima foto
						if(j==Cfichas){
							ultima = true;
						}
						//Subimos cada una de las fotos
						subirFoto(archivito.files[0], id, textarea.value, ultima, porno);
						console.log('AAAAAAAAAAAAAAAAAAAAa');
					}
				})	
			};
		},function(respuesta){
			console.log('Recuerda entrar desde el LOCALHOST');
		});

		return false;
	}


//---------------------------------------------------------------------------------------------------------------
	//Subiendo la foto. Archivito = inputFile, IDR es la j, texto base. Usamos "ultima" para saber cuando mostrar el mensaje
	//de receta subida. Porno es el nombre de la receta.

	function subirFoto(archivito, idReceta, texto, ultima, porno) {
		let url = './rest/receta/' + idReceta + '/foto'
		let usu = JSON.parse(sessionStorage.getItem('usuario'));
		let fd= new FormData();

		fd.append('l',usu.login);	//autorReceta tiene el nombre del autor de la receta en la que estoy actualmente
		fd.append('t', texto);
		fd.append('f', archivito);

		console.log(archivito);

		fetch(url,{'method':'POST', 'body':fd,'headers':{'Authorization':usu.clave}}).then(function(respuesta){
			if(!respuesta.ok){
				console.log('No has podido subir la foto');
				//Mensaje modal				
				Mensaje('Error', 'Se ha producido un error al intentar subir una foto', '#fbb', true, '', '');
			}
			else{
				respuesta.json().then(function(datos){
					console.log(datos);
					console.log('Has subido la foto');
					if(ultima){
						document.getElementById('formulario').reset();
						document.getElementById('Imagenes').innerHTML = '';
						document.getElementById('Insertando').innerHTML = '';
						Mensaje('Éxito', 'Se ha subido correctamente la receta ' + porno, '#bfb', false, 'index.html', '');
					}
				})	
			};
		},function(respuesta){
			console.log('Recuerda entrar desde el LOCALHOST');
		});
		return false;
	}





//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------


//ACERCA


function ACarga(){
	MostrarDatosSesion(false,0);
}
