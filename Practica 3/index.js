
// Constantes sobre las dimensiones del Canvas

const 	ancho =        360,
	  	alto  =        240;


// Variables

var 	nx 	  		=           6,		//Numero de columnas
		ny 	  		=           4,		//Numero de filas
		dimx  		=  ancho / nx,		//Ancho de cada cuadrito
		dimy  		=  alto  / ny,		//Largo de cada cuadrito
		color 		=	     null,		//Color que almacena el input color
		img   		=		 null,		//Imagen seleccionada
		jugando 	=		false,		//Booleano usado para cuando jugamos o no
		cronometro  =     		0,		//Cronometro para contar los segundos
		movimientos =			0,		//Movimientos que realizamos de las piezass
		descoloc    =			0,		//Piezas descolocadas totales
		control,						//
		arrayImagen,					//Array de las posiciones de cada foto-parte
		arrayPosX,						//Array de las esquinas superiores izquierda de cada cuadrito. Columnas
		arrayPosY,						//Array de las esquinas superiores izquierda de cada cuadrito. Filas
		ficha1= -1,						//Ficha 1 seleccionada
		ficha2=-1,						//Ficha 2 seleccionada
		cas1=-1,						//
		cas2=-1,						//
		selec1,							//Casilla X donde se está pinchando
		selec2,							//Casilla Y donde se está pinchando
		ayuda = false;					//Ayuda activada




//------------------------------------------------------------------------------------------------------------------

//Utilizar obligatoriamente para establecer la anchura de cada canvas
function prepararCanvas() {

	document.getElementById('terminar').disabled = true;
	document.getElementById('ayuda').disabled = true;
	document.getElementById('empezar').disabled = true;

	let canvas1 = document.getElementById('canvas1'),
		canvas2 = document.getElementById('canvas2');

	canvas1.width  = ancho;
	canvas1.height =  alto;

	canvas2.width  = ancho;
	canvas2.height =  alto;



	//Escribimos el texto de inserción de la foto. Dibujar texto
	let contexto1 = canvas1.getContext('2d');

	contexto1.font = "bold 20px sans-serif";
	contexto1.fillText('Haz click o arrastra una imagen aquí', ancho/2 - 174, alto/2 + 5);


	/* ------------------------------------------------------------------------------------------DRAG AND DROP */

		//Estos se usan para el resalto del canvas cuando se entra al canvas. 
		//Usamos una clase para que lo haga y la quitamos para que no lo haga cuando se sale del canvas.

			canvas1.ondragenter = function(evento) {
				if(!jugando)
					canvas1.classList.add('arrastrando');
			}

			canvas1.ondragleave = function(evento) {
				if(!jugando)
					canvas1.classList.remove('arrastrando');
			}


	canvas1.ondragover = function(evento) {
		if(!jugando) {
			evento.stopPropagation();
			evento.preventDefault();
		}
	};

	canvas1.ondrop = function(evento) {
		if(!jugando) {
			evento.stopPropagation();
			evento.preventDefault();

			let fichero = evento.dataTransfer.files[0];
			let	fr = new FileReader();
			let canvas = document.getElementById('canvas1');

			//Limpiamos el canvas antes de insertarla para que se quite el texto
			canvas.width = canvas.width;

				//Primero hacemos que la imagen se cargue en el FileReader
				fr.onload = function() {
					img = new Image();

					//Ahora dejamos que se cargue la imagen antes de copiarla en los dos canvas
					img.onload = function() {
						let contexto = canvas1.getContext('2d');
						contexto.drawImage(img, 0, 0, ancho, alto);

						contexto = canvas2.getContext('2d');
						contexto.drawImage(img, 0, 0, ancho, alto);

						//Se habilita el botón de empezar
						document.getElementById('empezar').disabled = false;

						//Quitamos la clase arrastrando para que deje de estar seleccionada 
						//una vez hemos terminado de arrastrar
						canvas1.classList.remove('arrastrando');
						
						//Llamamos a las funciones para que se activen todas las que tienen que hacer
						cambioDificultad();
						cambioColor();
						limpiarCanvas();	//En esta caso la imagen la vuelve a poner
						lineas();
					};
					//En este caso se usa esto pues depende de la selección del input file
					img.src = fr.result
				};

			fr.readAsDataURL(fichero);
		}
	};
	/* FIN DRAG AND DROP */
}



//---------------------------------------------------------------------------------------------------------------------


//La llamamos cuando seleccionamos la imagen desde el input file

function cargarImagen(ruta){

	let canvas1 = document.getElementById('canvas1');
	let	canvas2 = document.getElementById('canvas2');

	//Abrimos un objeto FILE que nos ayudara a leer la imagen con la funcion de abajo
	let fr = new FileReader();

	//Limpiamos el texto del canvas
	canvas1.width = canvas1.width;

	//Dejemos que lea la ruta del archivo antes de seguir
	fr.onload = function(){
		let imagen = new Image();

		//Dejamos que se cargue la imagen antes de seguir
		imagen.onload = function(){
			let contexto = canvas1.getContext('2d');
			contexto.drawImage(imagen, 0, 0, ancho, alto);

			contexto = canvas2.getContext('2d');
			contexto.drawImage(imagen, 0, 0, ancho, alto);

			//Se habilita el botón de empezar
			document.getElementById('empezar').disabled = false;

			//Quitamos la clase arrastrando
			canvas1.classList.remove('arrastrando');

			img = imagen;

			cambioDificultad();
			cambioColor();
			limpiarCanvas();		//En esta caso la imagen la vuelve a poner
			lineas();

		}

		imagen.src = fr.result;
	}
	fr.readAsDataURL(ruta.files[0]);

}




//---------------------------------------------------------------------------------------------------------------------

//Metemos el color en la variable y limpiamos el canvas y volvemos a dibujarlas en caso de que no haya imagen

function cambioColor() {
	color = document.getElementById('color').value;
	if(img != null) {
		limpiarCanvas();
		lineas();
	}
}



//---------------------------------------------------------------------------------------------------------------------

//Asignamos la nueva dificultad según el SELECT y limpiamos el canvas y volvemos a dibujar si no hay imagen

function cambioDificultad() {
	if(document.getElementById('dificultad').value === 'facil') {
		nx = 6;
		ny = 4;
		dimx  = ancho / nx;
		dimy  = alto  / ny;
	}
	else if(document.getElementById('dificultad').value === 'medio') {
		nx = 9;
		ny = 6;
		dimx  = ancho / nx;
		dimy  = alto  / ny;
	}
	else {
		nx = 12;
		ny =  8;
		dimx  = ancho / nx;
		dimy  = alto  / ny;
	}
	if(img != null) {
		limpiarCanvas();
		lineas();
	}
}



//---------------------------------------------------------------------------------------------------------------------

//Dibujamos las líneas en función del número de columnas y filas que deba haber
function lineas() {

	let canvas      = document.getElementById('canvas2');
	let contexto    = canvas.getContext('2d');

	// reseteo para evitar errores de estilo
	contexto.beginPath(); 
	contexto.strokeStyle = color;	//Usamos el color que nos dijeron
	contexto.lineWidth   = 2;

	//Hasta el número de columnas
	for(let i = 1; i < nx; i++) {
		contexto.moveTo(i * dimx, 0);
		contexto.lineTo(i * dimx, canvas.height);
	}

	//Hasta el número de filas
	for(let i = 1; i < ny; i++) {
		contexto.moveTo(0, i * dimy);
		contexto.lineTo(canvas.width, i * dimy);
	}

	//Pintamos también el borde del canvas
	contexto.rect(0, 0, canvas.width, canvas.height);
	contexto.stroke();
}




//---------------------------------------------------------------------------------------------------------------------

//Limpiamos el canvas 2 y en caso de que ya hubiese imagen la volvemos a poner

function limpiarCanvas() {
	let canvas = document.getElementById('canvas2');
	canvas.width = canvas.width;

	if(img != null){
		contexto = canvas.getContext('2d');
		contexto.drawImage(img, 0, 0, ancho, alto);
	}
}



//---------------------------------------------------------------------------------------------------------------------

//Le damos al botón de empezar

function empezarJuego() {

	//El color, la dificultad, el input file (para que no se cambie la foto) y el propio empezar se deshabilitan
	document.getElementById('color').disabled = true;
	document.getElementById('dificultad').disabled = true;
	document.getElementById('empezar').disabled = true;
	document.getElementById('imagen').disabled = true;

	//Los botones de ayuda y terminar se habilitan
	document.getElementById('terminar').disabled = false;
	document.getElementById('ayuda').disabled = false;

	//Se borran las clases arrastrando y seleccionable para que no se destaque el canvas, ya que no se puede
	document.getElementById('canvas1').classList.remove('seleccionable', 'arrastrando');

	//Empieza el juego
	jugando = true;

	//Colocamos los valores de cada marcador, activamos el cronometro, y le cambiamos el display para que se vea
	document.getElementById('tiempo').innerHTML = cronometro;
	document.getElementById('piezas').innerHTML = descoloc;
	document.getElementById('mov').innerHTML = movimientos;
	document.getElementById('marcador').style.display = 'flex';
	control = setInterval(reloj, 1000);

	//Mandamos a desordenar las piezas
	desordenar();


	// A partir de ahora controlamos las selecciones de las fichas y el paso del ratón por el canvas
	let canvas = document.getElementById('canvas2');
	
	//Estamos intentando seleccionar una ficha
	canvas.onmousedown = function(e){
		//Solo hará algo si estamos jugando
		if(jugando) {
			//Calculamos la casilla donde está pinchando
			let x = Math.floor(e.offsetX/dimx);
			let y = Math.floor(e.offsetY/dimy);
			selec1=x;
			selec2=y;

			//No hay ninguna seleccionada. La seleccionamos guardando la casilla que es (14 = 2+2*6)
			if(ficha1 === -1){
				ficha1 = x+y*nx;
				dibujarSeleccion(x,y);
			}
			//No hay segunda seleccionada. Guardamos la casilla que es (5 = 1+1*4)
			else if(ficha2 === -1){
				ficha2 = x+y*nx;
			}

			//Si son la misma casilla y se repinta para quitar la seleccion
			if(ficha1 === ficha2){
				ficha1=-1;
				ficha2=-1;
				repintando();
			}
			//Si no lo son y hay casillas guardadas, se intercambian de posición y se repinta para quitar la seleccion 
			//y ver las fichas cambiadas
			else if(ficha1!==-1 && ficha2!==-1){
				let aux = arrayImagen[ficha1];
				arrayImagen[ficha1]=arrayImagen[ficha2];
				arrayImagen[ficha2] = aux;
				repintando();
				ficha1=-1;
				ficha2=-1;
				movimientos++;
				document.getElementById('mov').innerHTML = movimientos;
				comprobar();
			}
		}
	}


	//Cuando pasamos el ratón por encima, hay una imagen y estamos jugando...
	canvas.onmousemove = function(e){
		if(img!=null && e.offsetX >= 0 && e.offsetY >= 0 && jugando){
			let x = Math.floor(e.offsetX/dimx);
			let y = Math.floor(e.offsetY/dimy);	
			console.log(x+' '+y);
			repintando();
			//Mandamos la posición de la casilla que tenemos que pintar
			dibujarCuadrado(x,y);
			//Si salimos de esa casilla repintamos para que se quite la selección
			canvas.onmouseleave = function(e){
				repintando();
			}
		}
	}
}




//---------------------------------------------------------------------------------------------------------------------

//Aumentamos el cronometro cuando se llama desde empezar

function reloj() {
	cronometro++;
	document.getElementById('tiempo').innerHTML = cronometro;
}




//---------------------------------------------------------------------------------------------------------------------

//Terminamos el juego

function terminarJuego() {
	//Paramos el reloj y miramos cuantas quedan por colocar
	clearInterval(control);
	descoloc=0;
	for(let i = 0; i < arrayImagen.length; i++) {
		console.log('Entras o no puto')
		if(i != arrayImagen[i]) {
			descoloc++;
			console.log('Holi?')
		}
	}

	//Paramos el juego y activamos los botones que debemos y desactivamos los otros
	jugando = false;
	document.getElementById('terminar').disabled = true;
	document.getElementById('ayuda').disabled = true;
	document.getElementById('color').disabled = false;
	document.getElementById('dificultad').disabled = false;
	document.getElementById('imagen').disabled = false;

	//Vaciamos el valor de la imagen y ponemos la variable a null
	document.getElementById('imagen').value = '';
	img = null;

	//Activamos la clase seleccionable, ya que ya no hay foto
	document.getElementById('canvas1').classList.add('seleccionable');

	//Ocultamos el marcador
	document.getElementById('tiempo').innerHTML = '';
	document.getElementById('marcador').style.display = 'none';

	//Mensaje de juego terminado
	Mensaje('Fin del juego','Has dejado ' + descoloc + ' piezas por colocar bien después de ' + movimientos + ' movimientos, y has empleado ' + cronometro + ' segundos', '#fbb');
	
	//Reiniciamos las variables
	cronometro = 0;
	movimientos = 0;
	descoloc = 0;

	//Vaciamos el canvas el array y llamamos a preparar canvas, que es como si se reiniciase todo
	document.getElementById('canvas1').width = ancho;
	limpiarCanvas();
	arrayImagen = null;
	prepararCanvas();
}




//---------------------------------------------------------------------------------------------------------------------

//Desordenando las fichas

function desordenar(){

	//Inicializamos los array con la ćantidad de casillas que deberían haber
	arrayImagen = new Array(nx*ny);
	arrayPosX = new Array(nx*ny);
	arrayPosY = new Array(nx*ny);

	//Le damos valor según la posición
	for(let i = 0; i < arrayImagen.length; i++) {
		arrayImagen[i] = i;
	}

	//Lamamos a la función de desordenar
	desordenando();

	let canvas1 = document.getElementById('canvas1'),
		contexto1 = canvas1.getContext('2d'),
		canvas2 = document.getElementById('canvas2'),
		contexto2 = canvas2.getContext('2d'),
		imagen;

	//Ponemos cada casilla en su lugar
	for(let i = 0; i < arrayImagen.length; i++) {
		let casX = Math.floor(arrayImagen[i] / nx),
			casY = arrayImagen[i] % nx;

		//Posicion del canvas desde donde vamos a coger la ficha y la dimensión
		imagen = contexto1.getImageData(casY*dimy,casX*dimx, dimx, dimy);
		//Imagen, lugar donde debemos poner la imagen
		contexto2.putImageData(imagen,i%nx*dimy,Math.floor(i/nx)*dimx);
		//Volvemos a poner las lineas
		lineas();
		if(i != arrayImagen[i]) {
			descoloc++;
		}
	}
	document.getElementById('piezas').innerHTML = descoloc;
}




//---------------------------------------------------------------------------------------------------------------------

//Funcion de desordenar el array
function desordenando() {
  var iActual = arrayImagen.length, aux, iRandom;

  while (0 !== iActual) {
    iRandom = Math.floor(Math.random() * iActual);
    iActual -= 1;

    aux = arrayImagen[iActual];
    arrayImagen[iActual] = arrayImagen[iRandom];
    arrayImagen[iRandom] = aux;
  }
}




//---------------------------------------------------------------------------------------------------------------------

//MENSAJE

function Mensaje (h2, msj, color){
	/*
		h2 -> título del mensaje
		msj -> contenido del mensaje
		color -> color del mensaje (#XXX / #XXXXXX)
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
		var caja = document.getElementById('caja');
		document.body.removeChild(caja);
		var translucido = document.getElementById('translucido');
		document.body.removeChild(translucido);
	}

	caja.appendChild(titulo);
	caja.appendChild(contenido);
	caja.appendChild(boton);

	document.body.appendChild(translucido);
	document.body.appendChild(caja);

	boton.focus(); // el focus hay que hacerlo DESPUÉS de añadir el boton al documento
}





//---------------------------------------------------------------------------------------------------------------------

//Clicamos el botón para mostrar la ayuda

function mostrarAyuda(){
	let canvas = document.getElementById('canvas2');
	let contexto = canvas.getContext('2d');

	if(!ayuda) {
		for(var i = 0; i<(nx*ny);i++){
			if(arrayImagen[i]!=i){
				let posx = Math.floor(i/nx)*dimx;
				let posy = (i%nx)*dimy;
				contexto.fillStyle= 'rgba(255,0,0,0.6)';
				contexto.fillRect(posy,posx,dimx,dimy);
				lineas();
			}
		}
		ayuda = true;
	}

	canvas.onmouseenter = function(e){

		if(jugando){
			let canvas1 = document.getElementById('canvas1'),
				contexto1 = canvas1.getContext('2d'),
				canvas2 = document.getElementById('canvas2'),
				contexto2 = canvas2.getContext('2d'),
				imagen;
			
			repintando()
			ayuda = false;
		}
	}
}






//---------------------------------------------------------------------------------------------------------------------

//Dibujamos la pieza seleccionada

function dibujarSeleccion(x,y){
	if(x>=0&&y>=0){
		let canvas = document.getElementById('canvas2');
		let contexto = canvas.getContext('2d');

		let posx = x*dimx;
		let posy = y*dimy;
		contexto.fillStyle= 'rgba(0,0,255,0.6)';
		contexto.fillRect(posx,posy,dimx,dimy);
		lineas();
	}
}





//---------------------------------------------------------------------------------------------------------------------

//Pintamos todo otra vez

function repintando() {

	let canvas1 = document.getElementById('canvas1'),
		contexto1 = canvas1.getContext('2d'),
		canvas2 = document.getElementById('canvas2'),
		contexto2 = canvas2.getContext('2d'),
		imagen;

	if(arrayImagen != null){
		for(let i = 0; i < arrayImagen.length; i++) {
			let casX = Math.floor(arrayImagen[i] / nx),
			casY = arrayImagen[i] % nx;
			//Ponemos cada casilla
			imagen = contexto1.getImageData(casY*dimy,casX*dimx, dimx, dimy);
			contexto2.putImageData(imagen,i%nx*dimy,Math.floor(i/nx)*dimx);
			lineas();
			if(i != arrayImagen[i]) {
				descoloc++;
			}
		}
	}
}



//---------------------------------------------------------------------------------------------------------------------

//Comprobamos si hemos acabado

function comprobar(){
	descoloc=0;
	for(let i = 0; i < arrayImagen.length; i++) {
		if(i != arrayImagen[i]) {
			descoloc++;
		}
	}
	document.getElementById('piezas').innerHTML = descoloc;
	
	if(descoloc==0){
		clearInterval(control);
		jugando = false;
		document.getElementById('terminar').disabled = true;
		document.getElementById('ayuda').disabled = true;
		document.getElementById('color').disabled = false;
		document.getElementById('dificultad').disabled = false;
		document.getElementById('imagen').disabled = false;
		document.getElementById('imagen').value = '';
		img = null;
		document.getElementById('canvas1').classList.add('seleccionable');
		document.getElementById('tiempo').innerHTML = '';
		document.getElementById('marcador').style.display = 'none';
		Mensaje('Fin del juego','¡¡¡Enhorabuena!!! Has montado el puzzle en '+cronometro+' segundos y ' + movimientos + ' movimientos', '#bfb');
		cronometro = 0;
		movimientos = 0;
		descoloc = 0;
		document.getElementById('canvas1').width = ancho;
		limpiarCanvas();
		arrayImagen = null;
		prepararCanvas();
	}
}





//---------------------------------------------------------------------------------------------------------------------

//Pintamos el cuadradipor por el que pasamos

function dibujarCuadrado(x,y){
	if(x>=0&&y>=0){
		let canvas = document.getElementById('canvas2');
		let contexto = canvas.getContext('2d');

		let posx = x*dimx;
		let posy = y*dimy;
		contexto.fillStyle= 'rgba(0,255,0,0.4)';
		contexto.fillRect(posx,posy,dimx,dimy);
		if(ficha1!==-1){
			dibujarSeleccion(selec1,selec2)
		}
		lineas();
	}
}