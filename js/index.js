import { File } from "./model/file.js";
import { Validation } from "./model/validation.js";

const loader = new File(['ch']);
const fileInput = document.querySelector('input[type="file"]');
let fileContent = []
fileInput.addEventListener('change', function() {
const file = fileInput.files[0];
loader.loadFile(file, function(contenido) {
    const validation = new Validation(contenido);
    validation.validComments();
});

});

// class MyClass {
//     myMethod(param, callback) {
//       // lógica del método
//       const resultArray = [1, 2, 3]; // supongamos que este es el arreglo que devuelve el callback
  
//       // llamada al callback con el arreglo de resultados
//       callback(resultArray);
//     }
//   }
  
//   const myInstance = new MyClass();
  
//   const resultsArray = [];
  
//   // llamada al método de la clase con un callback
//   myInstance.myMethod("parametro", (results) => {
//     // agregar cada elemento del arreglo al array de resultados
//     results.forEach((result) => {
//       resultsArray.push(result);
//     });
//   });
  
//   console.log(resultsArray); // imprimir el array de resultados