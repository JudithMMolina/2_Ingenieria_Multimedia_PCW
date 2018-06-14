function anyadirFinal () {
	
	let ul = document.querySelector('ul'),
		li;

	li = document.createElement('li');	//Crea un objeto
	li.innerHTML = '<a href="http://www.ua.es">UA</a>';
	//li.textContent = '<a href="http://www.ua.es">UA</a>';
	//ul.appendChild(li);												//Lo añade al ul del documento
	//ul.insertBefore(li, ul.querySelector('li:nth-of-type(2)'));		//Lo pone delante del segundo	
	ul.insertBefore(li, ul.childNodes[2]);
}


function mostrarRecetas(v){
	
	let html = '';
	v.FILAS.forEach(function(e,idx,vector){
		html += `<li>$(e.nombre)</li>`
	});
	document.querySelector('ul').innerHTML = html;
}


//Utilizando AJAX
function pedirRecetas(){

	let xhr = new XMLHttpRequest(),
		url = './rest/receta/?u=6';

	xhr.open('GET', url, true); 							//Abrimos la conexion y la configuramos.
													// 1.
													// 2.
													// 3. ¿Queremos que la conexion sea asincrona?
		xhr.onload = function(){
			console.log(xhr.responseText);
			let r = JSON.parse(xhr.responseText);
			console.log(r);
		};

	xhr.send();
}

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