
*** INDICE ***

	AJAX: 									15
	FORMDATA: 								118
	FETCH: 									144
	VALIDANDO FORMULARIOS: 					200
	MANIPULACIÓN DEL ATRIBUTO CLASS : 		240
	EXCEPCIONES: 							254
	WEB STORAGE: 							


-------------------------------------------------------------------------------------------------------------

-- AJAX 

	XMLHttpRequest()

		abort() 							--> Detiene la petición en curso 
		getAllResponseHeaders()				--> Devuelve todas las cabeceras HTTP de la respuesta como una cadena 
		getResponseHeader(etiqueta)			--> Devuelve el valor de la etiqueta de la cabecera HTTP de la respuesta que se le pasa como parámetro 

		open(metodo, URL, ?asincrono, ?usuario, ?password) 		

			metodo 		--> GET o POST 
			url 		--> direccion URL, relativa o absoluta, hacia el recurso en el servidor 
			asíncrono 	--> Especifica si la petición será asíncrona (true) o sincrona (false)

		send(datos)							--> Envía la petición al servidor. En datos se envía la información al servidor
												cuando el método es POST. En caso contrario, se envía la URL 
		setRequestHeader(etiqueta, valor)	--> Añade un par etiqueta/valor a la cabecera HTTP a enviar al servidor 


		readyState() 						--> Devuelve el estado del objeto, pudiendo ser 0 (sin incicializar),
												1 (abierto), 2 (cabeceras recibidas), 3 (cargando) y 4(completado)
		responseType()						--> Devuelve el tipo de información de la respuesta 
		responseBody()						--> Devuelve la respuesta como un array de bytes 
		responseText()						--> Devuelve la respuesta en el formato XML 
		status() 							--> Devuelve el código de estado de la peticion HTTP de respuesta 
		statusText() 						--> Devuelve el estado de la petición HTTP enviado por el servidor como una
												cadena de texto asociada al codigo de la propiedad status
		timeout() 							--> Permite establecer un tiempo máximo de espera para completar la petición



	-- EVENTOS AJAX

		onloadstart()			--> Se dispara al inicial la carga (antes del envío)
		onprogress() 			--> Se dispara periódicamente con información de estado 
		onabort()				--> Se dispara al abortar la petición 
		onerror()				--> Se dispara cuando se produce un error
		onload() 				--> Se dispara cuando ha finalizado con éxito la petición 
		ontimeout()				--> Se dispara cuando se ha agotado el tiempo de espera y no se ha completado la petición 
		onreadystatechange() 	--> Se dispara con cada cambio de estado 
		onloadend()				--> Se dispara cuando la petición se ha completado  



	// GET
	
	function peticionAJAX_GET(url) {
		let xhr = new XMLHttpRequest();
		if(xhr) { // Si se ha creado el objeto, se completa la petición ...
			let login = document.getElementById("login").value, // Se preparan los
				pass = document.getElementById("pass").value; // argumentos ...
			url += "?l=" + login + "&p=" + pass; // se añaden los argumentos a la url
			url += "&v=" + (new Date()).getTime(); // Truco: evita utilizar la cache
			xhr.open("GET", url, true); // Se crea petición GET a url, asíncrona
			// El manejador de eventos onload ejecuta la función callback cuando
			// finaliza la petición y se recibe la respuesta.
			xhr.onload = function(){ // función callback
				document.getElementById("miDiv").innerHTML = xhr.responseText;
			};
			xhr.send(); // Se envía la petición
		}
		return false;
	}



	//POST

	var obj = new XMLHttpRequest(); // variable que guarda el objeto XMLHttpRequest
	function peticionAJAX_POST(url) {
		if (obj) { // Si se ha creado el objeto, se completa la petición ...
			// Argumentos:
			var login = document.getElementById("login").value;
			var pass = document.getElementById("pass").value;
			var args = "l=" + login + "&p=" + pass;
			args += "&v=" + (new Date()).getTime(); // Truco: evita utilizar la cache
			// Se establece la función (callback) a la que llamar cuando cambie el estado:
			obj.onreadystatechange = procesarCambio; // función callback: procesarCambio
			obj.open("POST", url, true); // Se crea petición POST a url, asíncrona
			// Es necesario especificar la cabecera "Content-type" para peticiones POST
			obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			obj.send(args); // Se envía la petición. Los argumentos van aquí.
		}
		return false;
	}
	

	// Tratar la respuesta

	function procesarCambio(){
		if(obj.readyState == 4){ // respuesta recibida y lista para ser procesada
			if(obj.status == 200){ // El valor 200 significa "OK"
				// Aquí se procesa lo que se haya devuelto:
				document.getElementById("miDiv").innerHTML = obj.responseText;
			} else alert("Hubo un problema con los datos devueltos"); // ERROR
		}
	}




---------------------------------------------------------------------------------------------------

-- FORMDATA

	var fd = new FormData(formulario)

		fd.append(nombre, valor); 			--> Permite añadir nuevas entradas a la lista de pares



	function peticionAjax(frm){
		var fd = new FormData( frm );
		var xhr= new XMLHttpRequest();
		fd.append('op','3'); // se añade una nueva entrada a la lista de entradas
		xhr.onload = function(){
			// respuesta recibida del servidor una vez finalizado el envío. Se supone
			// que la respuesta es texto en formato JSON.
			let r = JSON.parse(xhr.responseText);
		};
		xhr.open('POST', 'upload.php', true);
		xhr.send(fd);
		return false;
	}



---------------------------------------------------------------------------------------------------

-- FETCH 

	Mira las diapositivas a partir de la 25 

	*fetch() devuelve una promesa que siempre resuelve, nunca hará reject independientemente 
	del código de error HTTP de la respuesta.
	*En el caso de producirse un código de error HTTP, fetch() resolverá con la propiedad ok a false 
	*El único caso en el que fetch() no hará resolve es si se produce un fallo de red. En este caso se 
	puede usar .catch() para capturar el error.

	Se invoca con:
		fetch(objeto_request)
		fetch(input, init?)


	/* EJEMPLO GET*/
	function peticionFetchAPI_GET() {
		var url = 'rest/comentario/?u=5';
		// fetch usa el método GET por defecto
		fetch(url).then(function(response){
			if(!response.ok){ // if(response.status!=200)
				console.log('Error(' + response.status + '): ' + response.statusText);
				return;
			}
			response.json().then(function(data) { // se tiene la respuesta
				console.log(data); // data es un objeto JSON
			});
		}).catch(function(err) {
			console.log('Fetch Error: ', err);
		});
	}


	/*EJEMPLO POST*/
	function peticionFetchAPI_POST( form_HTML, clave ) {
		var url = 'rest/login/',
			fd = new FormData(form_HTML), // se utiliza un objeto FormData()
			init = { method:'post', body:fd, headers:{'Authorization':clave} };
		
		fetch(url,init).then(function(response){
			if(!response.ok){
				console.log('Error con código: ' + response.status);
				return;
			}
			response.json().then(function(data) { // se tiene la respuesta
				console.log('Nombre:' + data.nombre); // data es un objeto JSON
			});
		}).catch(function(err) {
			console.log('Fetch Error: ', err);
		});
	}



-----------------------------------------------------------------------------------------------------

-- VALIDAR FORMULARIOS

	Evento invalid() 				-->		Se dispara para cada elemento del formulario en el que se produce un error de validación 
	Atributo validity()				-->		Atributo del elemento que lanzó el evento invalid y cuyo valor indica el tipo de error 
	Método setCustomValidity(msg)	-->		Permite especificar un mensaje de error personalizado que 
											sustituirá al que muestra el navegador por defecto

	POSIBLES CODIGOS DE ERROR.

		valueMissing		--> El campo es requerido y está vacio
		typeMismatch		--> El valor del campo no es el esperado 
		patternMismatch		--> El valor del campo no coincide con el pattern 
		tooLong				--> Demasiado largo 
		rangeUnderflow		--> Valor del campo menor que el min 
		rangeOverflow		--> Valor del campo es mayor que el de max 
		stepMismatch		--> Valor de campono válido según el de step 
		valid 				--> Válido 


	function personalizarValidacion(){
		var errMsg="", vCampos = document.querySelectorAll("input:not([type=submit])");
		for(var i=0;i<vCampos.length;i++){
			errMsg = "Valor de campo no válido"; // texto del mensaje por defecto
			vCampos[i].addEventListener("invalid",function(e){ // manejador del evento
				if(e.target.validity.valueMissing)
					errMsg = "El campo no puede quedar vacío";
				else if(e.target.validity.typeMismatch)
					errMsg = "El valor no es correcto";
				// else if()...
				e.target.setCustomValidity(errMsg); // se asigna el nuevo mensaje de error
			});
			vCampos[i].onchange = function(e){e.target.setCustomValidity("");};
		}
	}




-----------------------------------------------------------------------------------------------------

-- MANIPULACIÓN DEL ATRIBUTO CLASS 

	.classList.add(clase) 			--> Añade la clase al elemento 
	.classList.remove(clase)		--> Elimina la clase del elemento
	.classList.contains(clase)		--> Devuelve true o false en función de si el el elemento asignado tiene la clase o no 
	.classList.toggle(clase)		--> Añade la clase al elemento si no la tiene, o la quita si la tiene 
	.classList.item(pos)			--> Devuelve la clase que ocupa la posición pos 
	.classList.toString()			--> Devuelve una cadena e texto con todas las clases del elemento separadas por espacios
	.classList.length 				--> Propiedad que devuelve el numero de clases que tiene asignadas el elemento



---------------------------------------------------------------------------------------------------

--EXCEPCIONES 

	try{  				//Bloque de instrucciones en el que se van a controlar las excepciones

	} catch(e){			//Bloque de instrucciones a ejecutar en caso de producirse una excepción
		console.log('ERROR:'+e)
	} finally {		//Bloque de instrucciones que se ejecutará siempre, da igual si hay exc o no

	}


	Para generar y lanzar manualmente excepciones: 
		throw new Error('wnvernber')




---------------------------------------------------------------------------------------------------

--WEB STORAGE 

	window.localStorage/sessionStorage 		-> devuelve cierto si el navegador lo soporta

	sessionStorage 	--> Almacenamiento temporal 
	localStorage 	--> Almacenamiento permanente 

		length 				-> devuelve el número de pares clave/valor 
		key(n)				-> devuelve el nombre de la clave que ocupa la posición n, o null si no existe 
		getItems(key)		-> devuelve el valor asociado a la clave key
		setItem(key, value)	-> si la key no existe, los crea. Si existe, actualiza 
		removeItem(key)		-> borra el par clave/valor
		clear()				-> borra la lista de pares

	
