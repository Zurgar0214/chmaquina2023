import { lineByLineFileReader } from "./model/fileReader.js";
import { Validation } from "./model/validation.js";
import { Interprete } from "./model/interpreter.js";
import { LineaPrueba } from "./model/lineByLineReader.js";
import { Procedure } from "./model/procedure.js"

const form = document.querySelector('#file-form');
const fileInput = document.querySelector('#file-input');
let memoryContainer = document.getElementById('memory-container');

// obtener la lista desplegable y el contenedor de radio botones
var priorityMethod = document.getElementById("priority-method"); // para obtener el método de ejecución
var radioButtonsContainer = document.getElementById("radio-buttons"); // para obtener si es expropiativo o no

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	console.log(e.submitter.id);
	let programa;
	let correrPrograma;
	let memoria = [];
	let instrucciones = [];
	let infEtiquetas = [];
	let infoVariables = [];
	let linea = new LineaPrueba();
	let auxiliar = getExpropiativeValue();

	const kernel = new Array(5).fill((Math.random() * 10).toString());
	const memory = new Array();
	const tamanioMemoria = 1000 + kernel.length
	memory.push(0);
	memory.push(kernel);

	let nuevo = [].concat(...memory);

	programa = new Interprete(nuevo, [], [], tamanioMemoria);
	memoryContainer.innerHTML = '';

	for (let index = 0; index < fileInput.files.length; index++) {
		const file = fileInput.files[index];

		try {
			const reader = new lineByLineFileReader();
			const lines = await reader.read(file);
			const validation = new Validation(lines);
			let fileContent = validation.validSintaxis();

			programa.setInstrucciones(fileContent)
			programa.setInstComment(lines)

			correrPrograma = programa.cargarPrograma(memoria);
			
			for (let i = 0; i < lines.length; i++) {
				document.getElementById('instructions-container').innerHTML += `<p class="">${(i+1)+'. '+lines[i]}</p>`
				
			}
			
			correrPrograma[2].forEach(etiqueta => {
				document.getElementById('etiquetas-container').innerHTML += `<p class="">${' identificador: '+etiqueta.identificador + ',  nombre:' + etiqueta.nombre + ',  posInstruc:' + etiqueta.posicionInstrucciones}</p>`
			})
			correrPrograma[3].forEach(variable => {
				document.getElementById('variables-container').innerHTML += `<p class="">${' nombre:'+variable.nombre + ',  posicion:' + variable.posicion + ',   identificador:' + variable.identificador + ',  tipo:' + variable.tipo +
					',  valor:' + variable.valor}</p>`
			})
			instrucciones.push(correrPrograma[1])
			infEtiquetas.push(correrPrograma[2])
			infoVariables.push(correrPrograma[3])
		} catch (err) {
			console.error(err);
		}
	}
	memoria = correrPrograma[0]

	// llama una funcion que se encarga de de correr el programa ya sea linea a line o de corrido.
	runProg(memoria, instrucciones, infEtiquetas, infoVariables, e, programa, getExpropiativeValue())
});


async function runProg(memoria, instrucciones, infEtiquetas, infoVariables, e, programa, metodo) {
	let contador = 0
	memoria.forEach(memoriaText => {
		memoryContainer.innerHTML += `<p>${contador} . ${memoriaText}</p>`
		contador++
	})
	contador = 0
	let proceso;
	if (e.submitter.id == 'submit-btn') {
		proceso = new Procedure(memoria,infEtiquetas,infoVariables,1)
	} else {
		proceso = new Procedure(memoria,infEtiquetas,infoVariables,0)
	}	

	switch (metodo) {
		case "FCFS":

			proceso.ElegirMetodo(instrucciones,0, programa)
			break;
		case "RR":
			
			proceso.ElegirMetodo(instrucciones,1, programa)
			break;
		case "SJF":

			proceso.ElegirMetodo(instrucciones,2, programa)
			break;
		case "SJFE":

			proceso.ElegirMetodo(instrucciones,3, programa)
			break;
		case "Priority":

			proceso.ElegirMetodo(instrucciones,4, programa)
			break;
	
		default:
			alert("No se reconoce el método de ejecución ingresado. Por favor, intente nuevamente")
			break;
	}
}


// agregar un event listener al cambio en la lista desplegable
priorityMethod.addEventListener("change", function () {
	// si se selecciona SJF o Prioridad, mostrar los radio botones
	if (priorityMethod.value === "SJF") {
		radioButtonsContainer.innerHTML = `
      <label>Seleccione el tipo de ${priorityMethod.value}: </label>
      <input type="radio" name="type" value="Expropiativo">Expropiativo
      <input type="radio" name="type" value="No expropiativo">No expropiativo
    `;
	} else {
		// si no se selecciona SJF o Prioridad, ocultar los radio botones
		radioButtonsContainer.innerHTML = "";
	}
});
function getExpropiativeValue() {
	let auxiliar;
	if (priorityMethod.value === "SJF") {
		// obtener el radio button seleccionado
		var radioButton = document.querySelector('input[name="type"]:checked');
		// obtener su valor
		auxiliar = radioButton.value;
	} else {
		auxiliar = 'None'
	}
	if (auxiliar == 'Expropiativo' && priorityMethod.value === "SJF") {
		return priorityMethod.value + 'E'
	} else {
		return priorityMethod.value;
	}
}