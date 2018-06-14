/*

	*** INDICE *** 

		--> PREPARAR CANVAS: 											35
		--> DRAG & DROP: 												44
		--> EVENTOS DE RATÓN: 											73
			--> mousemove - CALCULANDO EN QUE CASILLA ESTAMOS: 				76
			--> mousenter: 													106
			--> mouseleave: 												113	
			--> onclick: 													120
			--> onmousedown: 												142
			--> onmouseup: 													149
		--> SACANDO FILA Y COLUMNA: 									165
		--> PINTAR UN RECTANGULO: 										184
		--> TRASLACION, ROTACION, ESCALADO: 							201
		--> LIMPIAR CANVAS: 											233
		--> PINTAR IMAGEN: 												256
		--> PINTAR TROCITO: 											278
		--> COIPIAR IMAGEN: 											302
		--> DIBUJAR LINEAS: 											321

*/




var _ANCHO_ = 360;
var _ALTO_ = 360;
var ncols =	3;


// Preparar CANVAS

function prepararCanvas(){
	let canvas = document.querySelectorAll('canvas');

	canvas.forEach(function(e){
		e.width = _ANCHO_;
		e.height = _ALTO_;
	});


	//---------------------------------------------------------	DRAG&DROP
	let canvas01 = 	document.querySelector('#cv01');
	canvas01.ondragover	= function(e){
		e.stopPropagation();
		//	Return false;
		e.preventDefault();		
	}

	canvas01.ondrop	= function(e){
		e.stopPropagation();
		//	Return false;
		e.preventDefault();	

		let fichero = e.dataTransfer.files[0],
			fr = new FileReader();

		fr.onload = function(){
			let img = new Image();
			img.onload = function(){
				let contexto = canvas01.getContext('2d');
				contexto.drawImage(img,0,0,canvas01.width,canvas01.height);
			}
			img.src = fr.result;
		}	
		fr.readAsDataURL(fichero);

	}


	// -------------------------------------------------------------EVENTOS DE RATON

	let cv02 = document.querySelector('#cv02');
	cv02.onmousemove = function(e){
		//OFFSETX-Y son las dimensiones del canvas por las que pasamos el raton
		let x = e.offsetX,
			y = e.offsetY,
			dim = e.target.width / ncols,

			//Columna y fila en la que estamos
			[col,fila] = sacarFilaColumna(e);
		// Imprimirmos la columna-fila en la que estamos
		document.querySelector('#posXY').innerHTML = `(${x},${y}) (Col:${col},Fila:${fila})`
		
		if(cv02.getAttribute('data-FC')){
			let FC = JSON.parse(cv02.getAttribute('data-FC'));
			if(FC.fila == fila && FC.col == col)
				return false;
		}
			let FC = {'col':col,'fila':fila};
			cv02.setAttribute('data-FC', JSON.stringify(FC));
			console.log('REPINTANDO');
			cv02.width = cv02.width;

		// Pintar trozo imagen
		let ctx02 = cv02.getContext('2d');
		//Imagen a pintar, posicion que coge, tamaño del trozo que va a coger, posicion donde va a pintar y con que tamaño, escalando
		ctx02.drawImage(cv01, col*dim,fila*dim, dim,dim, col*dim,fila*dim,dim,dim);
		dibujarLineas();
	};


	// EL raton entra al canvas
	cv02.onmouseenter = function(e){
		let x = e.offsetX,
			y = e.offsetY;
		document.querySelector('#posEXY').innerHTML = `(${x},${y})`
	};

	// El rarón sale del canvas
	cv02.onmouseleave = function(e){
		let x = e.offsetX,
			y = e.offsetY;
		document.querySelector('#posSXY').innerHTML = `(${x},${y})`
	};

	//Se clica en el canvas y en que fila y columna
	cv02.onclick = function(e){
		
		let dim = e.target.width / ncols;
		let x = e.offsetX;
		let y = e.offsetY;

		[col,fila] = sacarFilaColumna(e);

		document.querySelector('#posCXY').innerHTML = `(${x},${y})`;
		document.querySelector('#posFCXY').innerHTML = `(${col},${fila})`;

		//Mostrar region imagen original
		let ctx01 = canvas01.getContext('2d'),
			ctx02 = cv02.getContext('2d'),
			//Para coger una parte de una imagen se necesita los dos contextos. Del que copias
			//al lugar al que lo ahces
			imgData = ctx01.getImageData(col*dim,fila*dim,dim,dim);
			ctx02.putImageData(imgData,col*dim,fila*dim);
			dibujarLineas();
	};

	// Se pincha con el ratón
	cv02.onmousedown = function(e){
		let x = e.offsetX,
			y = e.offsetY;
		document.querySelector('#posDXY').innerHTML = `(${x},${y})`
	};

	//Se suelta el boton del raton
	cv02.onmouseup = function(e){
		let x = e.offsetX,
			y = e.offsetY;
		document.querySelector('#posUXY').innerHTML = `(${x},${y})`
	};


}




//---------------------------------------------------------------------------------------

	//Se envarga de sacar la fila y la columna en la que estamos

	function sacarFilaColumna(e){
		//OFFSETX-Y son las dimensiones del canvas por las que pasamos el raton
		let x = e.offsetX,
			y = e.offsetY
			dim = e.target.width / ncols; 	//Ancho del canvas
		let fila, col;

		//Sacar fila y columna
		col = Math.floor(x / dim);
		fila = Math.floor(y / dim);

		return [col,fila]
	}


//----------------------------------------------------------------------------------------------

	//Se pinta un rectangulo

	function prueba01(){

		let canvas 		= 	document.querySelector('#cv01');
		let contexto 	= 	canvas.getContext('2d');

		
		contexto.strokeStyle 	= 	'#a00';
		contexto.lineWidth 		= 	2;
		
		contexto.strokeRect(0,0,100,75);
	}



//----------------------------------------------------------------------------------------------
	// Se translada de posición, se escala y se rota

	function transladar() {
		
		let canvas 		= 	document.querySelector('#cv01');
		let contexto 	= 	canvas.getContext('2d');

		contexto.translate(10,10);
	}


	function escalar() {
		
		let canvas 		= 	document.querySelector('#cv01');
		let contexto 	= 	canvas.getContext('2d');

		contexto.scale(1,2);
	}


	function rotar() {
		
		let canvas 		= 	document.querySelector('#cv01');
		let contexto 	= 	canvas.getContext('2d');
		let ang			=	45;

		contexto.rotate (Math.PI * (ang/180) );
	}



//----------------------------------------------------------------------------------------------

	//Se limpia el canvas desde el boton
	function limpiar(e){
			
		//e. target para acceder al objeto que hace el evento
		let footer = e.target.parentNode,
			section = footer.parentNode,
			cv = section.querySelector('canvas');

			cv.width = cv.width;

		return false;

		let canvas 		= 	document.querySelector('#cv01');
		let contexto 	= 	canvas.getContext('2d');
		canvas.width 	=	canvas.width;

}




//----------------------------------------------------------------------------------------------

//Pintar imagen
function pintarImagen01(){
	
	let canvas 		= 	document.querySelector('#cv01');
	let contexto 	= 	canvas.getContext('2d');
	let img 		=	new Image();


	// Esto sirve para que cargue la imagen antes de que se pinte, sino,
	// no pintara nada, debido a que no se a cargado nada aun.
	// Cuando la imagen se cargue, se dispara este evento.
	img.onload	=	function(){
		// Para que se ajuste al canvas son los dos ultimos parametros.
		// Los últimos 4 parametros sirven para decir que me recorte desde la posicion X, Y, la altura y la anchura que diga.
		contexto.drawImage(img,0,0,canvas.width, canvas.height-60);
	}
	img.src 	=	'imgs/shinx.png';
}



//----------------------------------------------------------------------------------------------

//Poner un trocito de la imagen de las chuches 
function recortar(){
	
	let canvas 		= 	document.querySelector('#cv01');
	let contexto 	= 	canvas.getContext('2d');
	let img 		=	new Image();

	// Esto sirve para que cargue la imagen antes de que se pinte, sino,
	// no pintara nada, debido a que no se a cargado nada aun.
	// Cuando la imagen se cargue, se dispara este evento.
	img.onload	=	function(){
		// Para que se ajuste al canvas son los dos ultimos parametros.
		// Los últimos 4 parametros sirven para decir que me recorte desde la posicion X, Y, la altura y la anchura que diga.
		contexto.drawImage(img,300,300,100,100,20,20,100,500);
	}
	img.src 	=	'imgs/chuches.jpg';

}



//----------------------------------------------------------------------------------------------

//Pone la imagen de un sitio al otro
function copiarImagen(){
	
	let canvas01 		= 	document.querySelector('#cv01'),
	canvas02 		= 	document.querySelector('#cv02'),
	contexto01 	= 	canvas01.getContext('2d'),
	contexto02 	= 	canvas02.getContext('2d'),
	imgData;

	imgData		=	contexto01.getImageData(0,0,canvas01.width,canvas01.height);
	
	contexto02.putImageData(imgData,0,0);

}



//----------------------------------------------------------------------------------------------

//Dibuja líneas
function dibujarLineas(){

	// Segundo canvas
	let canvas 		= 	document.querySelector('#cv02'),
		contexto 	= 	canvas.getContext('2d'),
		dim 		=	canvas.width / ncols;

	contexto.beginPath();
	contexto.strokeStyle 	=	'#a00';
	contexto.lineWidth		=	2;

	for(let i=1; i<ncols;i++){

		//Lineas horizontales
		contexto.moveTo(0,dim*i);
		contexto.lineTo(canvas.width, dim*i);

		//Lineas verticales
		contexto.moveTo(dim*i,0);
		contexto.lineTo(dim*i,canvas.height);

	}

	//Para que te pinte la gradilla
	contexto.rect(0,0,canvas.height,canvas.width)

	// Si no pongo esto, no pinta
	contexto.stroke();

}