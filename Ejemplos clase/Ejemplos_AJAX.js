
*** INDICE ***

	--> HACER LOGIN:  						12
	--> PEDIR RECETAS Y ESCRIBIRLAS: 		30
	--> AÑADIR CAMPO A LA LISTA: 			62



--------------------------------------------------------------------------------------------------------------

-- HACER LOGIN

function hacerLogin(frm){
	let xhr = new new XMLHttpRequest(),
		url = './rest/login/',
		fd = new new FormData(frm);

	xhr.open('POST', url, true);
		xhr.onload = function () {
			console.log(xhr.responseText);
		};
	xhr.send(fd);
	return false;
}


--------------------------------------------------------------------------------------------------------------

-- PEDIR RECETAS Y ESCRIBIRLAS

//Utilizando AJAX
function pedirRecetas(){

	let xhr = new XMLHttpRequest(),
		url = './rest/receta/?u=6';

	xhr.open('GET', url, true); 							//Abrimos la conexion y la configuramos.
		xhr.onload = function(){
			console.log(xhr.responseText);
			let r = JSON.parse(xhr.responseText);
			console.log(r);
		};
	xhr.send();

	mostrarRecetas(r);
}

function mostrarRecetas(v){
	
	let html = '';
	v.FILAS.forEach(function(e,idx,vector){
		html += `<li>$(e.nombre)</li>`
	});
	document.querySelector('ul').innerHTML = html;
}



--------------------------------------------------------------------------------------------------------------

-- AÑADIR UN CAMPO A LA LISTA

// Boton: <button onclick="anyadirFinal();">A&ntilde;adir al final</button>;

function anyadirFinal () {
	
	let ul = document.querySelector('ul');
	let	li;

	//ul.innerHTML += `<li name="i">+li+</li>`;
	li = document.createElement('li');	//Crea un objeto
	li.innerHTML = '<a href="http://www.ua.es">UA</a>';
	//li.textContent = '<a href="http://www.ua.es">UA</a>';
	//ul.appendChild(li);												// Lo añade al ul del documento
	//ul.insertBefore(li, ul.querySelector('li:nth-of-type(2)'));		// Lo pone delante del segundo	
	ul.insertBefore(li, ul.childNodes[2]);								// Sigue insertandose antes del segundo
				
}


