
*** INDICE ***

	--> HTML: 										19
	--> PREPARAR CANVAS: 							45
	--> PINTAR RECTANGULO: 							66
	--> RELLENAR RECTÁNGULO: 						85
	--> PONER SOMBRA:  								102
	--> LIMPIAR CANVAS: 							128
	--> DIBUJAR TEXTO: 								147	
	--> DIBUJAR TODO DE UNA VEZ (BEGIN PATH): 		175	



------------------------------------------------------------------------------------------


/*
	<body onload="PrepararCanvas();">
		<h1>Ejemplo de canvas: </h1>
		<section>
			<h2>Canvas 01</h2>
			<canvas id="cv01"></canvas>
			<br>
			<footer>
				<div>
					<!-- Hacemos esto para poder elelgir nosotros desde la web los colores -->
					<label>Color borde: <input type="color" id="color-borde" onchange="cambiarColorBorde();"></label><br>
					<label>Color relleno: <input type="color" id="color-relleno" onchange="cambiarColorRelleno();"></label>
					<button onclick="limpiar();">Limpiar canvas</button>
				</div>
				<br>
				<button onclick="dibujarRect();">Rectangulo</button>
				<button onclick="rellenarRect();">Rellenar rectangulo</button>
				<button onclick="rellenarRectSombra();">Poner Sombra</button>
				<button onclick="dibujartexto();">Dibujar Texto</button>
				<button onclick="dibujarPath02();">DibujarPath</button>
			</footer>
		</section>
	</body>
*/



var _ANCHO_	= 480;
var _ALTO_ 	= 360;


function PrepararCanvas() {

	//Siempre que se vaya a dibujar habrá que hacer estas dos variables
	let cv 			= document.querySelector('#cv01');
	let ctx 	= cv.getContext('2d');

	cv.width 	= _ANCHO_;
	cv.height 	= _ALTO_;

	ctx.strokeStyle = document.querySelector('#color-borde').value;
	ctx.fillStyle = document.querySelector('#color-relleno').value;

}


------------------------------------------------------------------------------------------

-- PINTAR RECTANGULO 

	function pintarRectangulo(){
		let cv = document.querySelector('body>section:first-of-type>canvas'),
			ctx = cv.getContext('2d');

		// Color de bordes
		ctx.strokeStyle = 'orange';
		//Establece un color para rellenar
		ctx.fillStyle	=	document.querySelector('#color-borde').value;
		//Establecer grosor de la linea de la figura
		ctx.lineWidth	=	2;
		//Dibuja un rectangulo pasandole las coordenadas y el ancho y alto.
		ctx.strokeRect(100,100,100,120);
	}


------------------------------------------------------------------------------------------

-- RELLENAR RECTANGULO 

	//Si rellenamos despues de dibujar el rectangulo, el relleno se come un poco el borde.

	function rellenarRect(){

		let cv 			= document.querySelector('#cv01');
		let ctx 	= cv.getContext('2d');

		//ctx.fillStyle	=	document.querySelector('#color-relleno').value;
		ctx.fillRect(100,100,100,120);

	}


------------------------------------------------------------------------------------------

-- PONER SOMBRA 

	//Le ponemos sombra
	function rellenarRectSombra(){

		let cv 			= document.querySelector('#cv01');
		let ctx 		= cv.getContext('2d');

		//ctx.fillStyle	=	document.querySelector('#color-relleno').value;

		//Desplazamiento
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;

		//Difuminado
		ctx.shadowBlur = 10;
		//Color de la sombra
		ctx.shadowColor = '#000';

		ctx.fillRect(100,100,100,120);

	} 


------------------------------------------------------------------------------------------

-- LIMPIAR CANVAS

	//Limpiar Canvas
	function limpiar(){

		let cv 			= document.querySelector('#cv01');
		let ctx 	= cv.getContext('2d');

		//limpiar un rectangulo(coordenadaX,cordenadaY,ancho,alto)
		//ctx.clearRect(0,0,cv.width ,cv.height);	

		//limpiar el canvas entero y ademas reseteamos las propiedades establecidas
		cv.width = cv.width;
	}



------------------------------------------------------------------------------------------

-- DIBUJAR TEXTO 


	function dibujartexto(){

		let cv 			= document.querySelector('#cv01');
		let ctx 	= cv.getContext('2d');

		//Establecemos la fuente. Estilo, Tamaño, Fuente
		ctx.font = 'bold 50px Georgia'

		ctx.textAlign = 'center';
		//Con sombra
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 10;
		ctx.shadowColor = '#747474';

		ctx.lineWidth = 2;
		ctx.fillText('¡Kawai! :3', cv.width/2, cv.height/2);
		ctx.strokeText('¡Kawai! :3', cv.width/2, cv.height/2);

	}



------------------------------------------------------------------------------------------

-- DIBUJAR TODO DE UNA VEZ (BEGIN PATH)

	function dibujarPath02(){

		let cv 			= document.querySelector('#cv01');
		let ctx 	= cv.getContext('2d');

		//Esto lo dejamos para los dos
		ctx.lineWidth = 4;

		//Cada BeginPath es un camino distinto
		ctx.beginPath();
		ctx.strokeStyle = '#a00';
		ctx.rect(100,100,100,50);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = '#0a0';
		ctx.rect(200,220,75,100);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(340,50);
		ctx.lineTo(400,200);
		ctx.strokeStyle = '#a0a';
		ctx.lineTo(400,100);
		//ctx.closePath();
		ctx.fill(),
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = '#0aa';
		ctx.lineWidth = 4;
		ctx.setLineDash([5,5]);
		ctx.lineDashOffset = 5;
		ctx.strokeRect(50,30,100,50);
		ctx.stroke();
	}