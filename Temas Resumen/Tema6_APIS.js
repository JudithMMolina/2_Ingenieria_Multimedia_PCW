
*** INDICE ***

	-->	CANVAS: 														25

		--> ESTILO Y SOMBRAS: 											35
		--> DIBUJAR TEXTO: 												58
		--> DIBUJAR RECTANGULOS: 										77
		--> DIBUJAR LINEAS: 											93
		--> DIBUJAR CÍRCULOS: 											107
		--> AGRUPAR OPERACIONES: 										117
		--> BORRADO DEL CANVAS: 										127
		--> RECORTE DEL CANVAS: 										133
		--> GUARDAR Y RESTAURAR ESTADO: 								139
		--> TRANSFORMACIONES:  											145
		--> DIBUJAR IMAGENES: 											163
		--> OBTENER LA IMAGEN DEL CANVAS PARA TRABAJAR CON ELLA: 		174

	--> DRAG & DROP: 													191



----------------------------------------------------------------------------------------------------

-- CANVAS 

	Lo primero que hay que hacer es obtener el contexto "2D"

		var cv 		= document.getElementById('miCanvas');
		var cxt 	= cv.getContext('2d')

	Una vez obtenido, ya se puede dibujar en él.


	-- ESTILO Y SOMBRAS

		.fillStyle 		( = valor)			--> Devuelve, o establece a valor, el color utilizado para rellenar las formas
		.strokeStyle 	( = valor) 			--> Devuelve o establece a valor el color usado para los bordes 
		.lineWidth 		( = valor) 			--> Devuelve o establece a valor el grosor de los bordes 
		.lineCap 		( = valor)			--> Devuelve, o establece a valor, el estilo de los finales de la línea.
			valor = butt 					Extremos planos de la línea 
			valor = round 					Extremos redondeados 
			valor = square 					Se añade un cuadrado en cada extremo de la línea
		
		.lineJoin 		( = valor)			--> Devuelve o establece valor, el estilo de la esquina a crear cuando se encuentran dos líenas
			valor = bevel					Crea una esquina de punta recortada (biselada)
			valor = round 					Crea una esquina redondeada 
			valor = miter 					Crea una esquina que acabaen punta (inglete)

		.miterLimit = valor 				-->Permite especificar el espacio, en unidades, destinado al inglete cuando .lineJoin = miter 
		.globalAlpha = valor 				-->Permite especificar el valor alpha
		.shadowOffsetX/Y = valor 			--> Permite aplicar sombras verticales y horizontales cuando 
												se dibuja
		.shadowBlur/shadowColor = valor 	--> Permite configurar la sombra a aplicar cuando se 
												dibuja


	-- DIBUJAR TEXTO

		.fillText(texto, x, y, maxWidth?)		--> Escribe el texto en la posición x,y. 
													Si se especificar maxWidth y el ancho del texto es mayor, 
													este se escalará.
		.strokeStyle(texto,x,y,maxWidth?)		--> Escribe el texto en la posicion x,y pintando el 
													borde con el valor indicado por strokeStyle.
													Si se especifica maxWidth y se pasa, lo escala.
		.font ( = valor)						--> Devuelve o establece el estilo de la fuente usado para dibujar texto.
		.textAlign ( = valor) 					--> Devuelve o establece la alineación horizontal del texto 
		.textBaseline ( = valor) 				--> Devuelve o establece la alineación vertical del texto 
			valor = alphabetic 
			valor = middle
			valor = top 
			valor = bottom




	-- DIBUJAR FORMAS RECTANGULARES 

		.fillRect(x, y, w, h)					--> Dibuja un rectángulo en (x,y) con un ancho de w 	
													y un alto de h, pintando interior y borde con el 
													valor de fillStyle. 
		.strokeRect(x, y, w, h) 				--> Bordes desde la pos (x,y) con ancho w y alto h con el 
													valor indicado por strokeStyle y lineWidth.
		.rect(x, y, w, h)						--> Funciona igual que .strokeRect(), pero para dibujarlo
													hay que llamar a la función .stroke()



	-- DIBUJAR LÍNEAS 

		.moveTo(x,y)							--> Mueve el pincel a la posición (x,y) del canvas.
		.lineTo(x,y)							--> Dibuja una línea des de la posición actual del 	
													incel, hasta (x,y) usando el estilo de línea de 
													strokeStyle y lineWidth.
		.stroke() 								--> Para que sea visible el dibujo de la línea

		.setLineDash ([5,15])					--> Permite configurar comó sería la línea discontinua.
													Por ejemplo, [5,15] implica segmentos de línea 5 y espacios de 15
		.lineDashOffset = valor 				--> Permite indicar a partir de qué unidad de la línea empezar a pintarla.



	-- DIBUJAR CÍRCULOS

		.arc(x, y, r, angInicio, angFin, sentido) 	--> Dibuja la circunferencia de un círculo de radio r,
														centrado en (x,y). Empieza a dibujar en el ángulo
														angInicio y termina en angFin siguiendo el sentido
														de las agujas del reloj si sentido es false. Angulos 
														en RADIANES .
														(EJ. arc(120, 100, 50, Math.PI/2, 2*Math.PI, false))


	-- AGRUPAR OPERACIONES

		.beginPath() 							--> Permite crear un nuevo path sobre el que aplicar
													un estilo distinto del usado hasta el momento.
													Tras acabar cada estilo, si quieres dibujarlo, usa 
													stroke()
		.closePath() 							--> Cierra un path uniendo el primer y último punto 
													dibujados, mediante una línea recta 


	-- BORRADO DEL CANVAS 

		.clearRect(x,y, ancho, alto) 			--> Borra el área del canvas delimitada por el rectángulo
													con esquina superior (x,y) y de ancho y alto indicado.


	-- RECORTE DEL CANVAS 

		.clip() 								--> Permite hacer que el path que se esté dibujando se 
													use como región de corte.


	-- GUARDAR Y RESTAURAR ESTADO

		.save()
		.restore()


	-- TRANSFORMACIONES 	

		.scale(x, y) 							--> Factor de escalado en los ejes, del 0 al 1 
		.rotate(angulo) 						--> En radianes en sentido de las agujas del reloj 
		.translate(x, y)						--> Translada desde el origen del canvas 

		.transform (fEscX, fdY, fdX, fEscY, tX, tY) 
			fEscX/Y 	-	factores de escalado x e y 
			fdX/fdY 	- 	factores de "estiramiento" x e y 
			tY/tY 		- 	factores de translación de x e y 

		.setTransform("")						--> Resetea la actual transformación a la matriz identidad
													y aplica una nueva
		.resetTransform() 						--> Resetea la actual transformación a la matriz identidad




	-- DIBUJAR IMAGENES 

		.drawImage(imagen, x, y, ancho?, alto?)			--> Dibuja la imagen en la pos (x,y) pudiendo
															cambiar las dimensiones de destino con ancho y alto 

		.drawImage(imagen, x, y, ancho, alto, dx, dy, dAncho, dAlto) 
			--> Copia la region del objeto imagen que empieza en la pos (x,y), cuyas dimensiones son ancho y alto
				y las dibuja en la pos (dx,dy) escalada al ancho y alto indicados por dAncho y dAlto 



	-- OBTENER LA IMAGEN DEL CANVAS PARA TRABAJAR CON ELLA 

		.getImageDate (x, y, ancho, alto) 		--> Devuelve un objeto ImgData que contiene el 
													vector de bytes que representa a lox píxeles de la 
													región del canvas cuya esquina superior izquierda
													es (x,y) y tiene ancho y alto especificado. 

		.putImageData(imgData, x, y, xCv?, yCv?, anchoCv?, altoCv?)
			--> Dibuja un objeto imgData en el canvas, en la posición (x,y). Si se indican los 3 ultimos
				parametros optatirvos, dibujará univamente la región imgData delimitada por el rectangulo 
				correspondiente a esos parámetros.




------------------------------------------------------------------------------------------------------------------

-- DRAG & DROP 

		1. 	Añadir al elemento arrastrable el atributo 'draggable', así como el código
			necesario para el evento 'dragStart' del elemento. La propiedad
			'dataTransfer', que debe establecerse en el evento dragstart, se utiliza para
			almacenar los datos a arrastrar.
		2. 	Añadir al elemento receptor el código necesario para los eventos dragOver y
			drop. En este código es conveniente cancelar la acción por defecto del
			navegador incluyendo la instrucción “return false;”, o bien mediante el
			método preventDefault() del objeto. También es conveniente cancelar la
			propagación del evento mediante el método stopPropagation() del objeto. En
			el evento drop es donde se procesa la propiedad dataTransfer.
		3. 	Se puede añadir código a otros eventos como dragEnter, dragOver,
			dragLeave y dragEnd, para enriquecer la experiencia del usuario.


		DIAPOSITIVA 54