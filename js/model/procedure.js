import { LineaPrueba } from "./lineByLineReader.js";
export class Procedure {
    constructor(memoria, infoEtiquetas, infoVariables, tipoEjecucion) {
        this.memoria = memoria;
        this.infoEtiquetas = infoEtiquetas;
        this.infoVariables = infoVariables;
        this.tipoEjecucion = tipoEjecucion;
    }

    ElegirMetodo(instrucciones, opcion, programa) {
        switch (opcion) {
            case 0:
                alert("Ejecución por orden de llegada");
                this.ordenDeLlegada(instrucciones, programa)
                break;
            case 1:
                alert("Ejecución Round-Robin");
                let quantum = prompt("Ingrese un valor para el quantum:");
                console.log(+quantum);
                this.RoundRobin(instrucciones, +quantum, programa)
                break;
            case 2:
                alert("Ejecución Shortest Job First");
                this.ShortestJobFirstNe(instrucciones, programa)
                break;
            case 3:
                alert("Ejecución Shortest Job First Expropiativo");
                this.SJFE(instrucciones, programa)
                break;
            case 4:
                let prioridad = []
                let valor
                for (let i = 0; i < instrucciones.length; i++) {
                    valor = prompt("Ingrese un valor de la prioridad del programa" + i +": ");
                    prioridad.push(+valor)
                }
                alert("Ejecución por prioridad");
                this.PrioridadNe(instrucciones, prioridad, programa)
                break;
            default:
                alert("Opción no válida")
                break;
        }

    }

    AsignarRafaga(instrucciones) {

        let excluidos = ["nueva", "etiqueta",
            "retorne", "//"
        ];
        let contador = 0;
        for (let i = 0; i < instrucciones.length; i++) {
            let instruccion = instrucciones[i].split(" ");
            if (!excluidos.includes(instruccion[0])) {
                contador++;
            }
        }
        return contador;
    }

    AsignarTiempoLlegada(instrucciones) {
        let tiempos = [];
        for (let i = 0; i < instrucciones.length; i++) {
            if (i == 0) {
                tiempos.push(0);
            }
            else {
                tiempos.push(Math.round((tiempos[i - 1] + this.AsignarRafaga(instrucciones[i])) / 4))
            }
        }
        return tiempos;
    }

    async ordenDeLlegada(instrucciones, programa) {

        if (this.tipoEjecucion == 0) {
            let ejecutar = new LineaPrueba();
            for (let i = 0; i < instrucciones.length; i++) {
                await ejecutar.runLineaLinea(this.memoria, instrucciones[i], this.infoEtiquetas[i], this.infoVariables[i], 0, instrucciones[i].length + 3000);
            };
        } else {
            for (let j = 0; j < instrucciones.length; j++) {
                programa.runPrograma(this.memoria, instrucciones[j], this.infoEtiquetas[j], this.infoVariables[j], 0, instrucciones[j].length + 3000);
            }
        }
    }

    async ShortestJobFirstNe(instrucciones, programa) {
        let json = []
        let instruccionesSjf = []
        let variables = []
        let etiquetas = []

        for (let i = 0; i < instrucciones.length; i++) {
            console.log("Rafaga: " + this.AsignarRafaga(instrucciones[i]));
            console.log(instrucciones[i]);
            json.push({
                "Instruccion": instrucciones[i], "Rafaga": this.AsignarRafaga(instrucciones[i]),
                "InfoEtiquetas": this.infoEtiquetas[i], "InfoVariables": this.infoVariables[i]
            })
        };
        json.sort(function (a, b) {
            return a.Rafaga - b.Rafaga;
        })
        instruccionesSjf.push(instrucciones[0]);
        variables.push(this.infoVariables[0])
        etiquetas.push(this.infoEtiquetas[0])

        json.forEach(element => {
            if (element.Instruccion != instruccionesSjf[0]) {
                instruccionesSjf.push(element.Instruccion);
                variables.push(element.InfoVariables)
                etiquetas.push(element.InfoEtiquetas)
            }
        });
        if (this.tipoEjecucion == 0) {
            let ejecutar = new LineaPrueba();
            for (let i = 0; i < instruccionesSjf.length; i++) {
                await ejecutar.runLineaLinea(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, 0, json[i].Instruccion.length + 3000);

            };
        } else {
            for (let j = 0; j < instruccionesSjf.length; j++) {
                programa.runPrograma(this.memoria, json[j].Instruccion, json[j].InfoEtiquetas, json[j].InfoVariables, 0, json[j].Instruccion.length + 3000);

            }
        }
    }

    async PrioridadNe(instrucciones, prioridad, programa) {
        let json = []
        let instruccionesSjf = []
        let variables = []
        let etiquetas = []
        let ejecutar = new LineaPrueba();
        for (let i = 0; i < instrucciones.length; i++) {
            console.log("Rafaga: " + this.AsignarRafaga(instrucciones[i]));
            console.log(instrucciones[i]);
            json.push({
                "Instruccion": instrucciones[i], "Prioridad": prioridad[i],
                "InfoEtiquetas": this.infoEtiquetas[i], "InfoVariables": this.infoVariables[i]
            })
        };
        json.sort(function (a, b) {
            return b.Prioridad - a.Prioridad;
        })

        json.forEach(element => {
            instruccionesSjf.push(element.Instruccion);
            variables.push(element.InfoVariables)
            etiquetas.push(element.InfoEtiquetas)
        });
        if (this.tipoEjecucion == 0) {
            for (let i = 0; i < instruccionesSjf.length; i++) {
                await ejecutar.runLineaLinea(this.memoria, instruccionesSjf[i], etiquetas[i], variables[i], 0, instruccionesSjf.length + 3000);
            };
        } else {
            for (let j = 0; j < instruccionesSjf.length; j++) {
                console.log(instruccionesSjf[j]);
                programa.runPrograma(this.memoria, json[j].Instruccion, json[j].InfoEtiquetas, json[j].InfoVariables, 0, json[j].Instruccion.length + 3000);

            }
        }
    }

    SJFE(instrucciones, programa) {
        // arreglo donde se guardaran los datos
        let json = []
        let tiempoLlegada = this.AsignarTiempoLlegada(instrucciones);
        // datos iniciales para cada uno de programas cargados.
        for (let i = 0; i < instrucciones.length; i++) {
            console.log("Rafaga: " + this.AsignarRafaga(instrucciones[i]), tiempoLlegada[i]);
            json.push({
                "Rafaga": this.AsignarRafaga(instrucciones[i]),
                "Instruccion": instrucciones[i],
                "Tiemporllegada": tiempoLlegada[i],
                "acumulador": 0,
                "linea": 0,
                "InfoEtiquetas": this.infoEtiquetas[i], "InfoVariables": this.infoVariables[i]
            })
        };
        // recorremos el json con los datos  ejecutamos y hacmeos la actualizaciones necesarias.
        this.SJFEX(json, programa);

    }

    async SJFEX(json, programa) {

        let noTerminados = [];
        let ejecutar = new LineaPrueba();
        let retorno;

        // caso en que se cargara unicamente un programa.
        if (json.length == 1) {
            programa.runPrograma(this.memoria, json[0].Instruccion, json[0].InfoEtiquetas, json[0].InfoVariables, 0, json[0].Instruccion.length + 300);
            return;
        }
        // cuando son mas de un programa.
        if (this.tipoEjecucion == 0) {

            for (let i = 0; i < json.length; i++) {

                let inicio = json[i].linea;

                // calculamos la cantidad de lineas que deben ejecutarse
                let cantInstr = json[i + 1].Tiemporllegada - json[i].Tiemporllegada;
                // actualizamos la cantidad de rafajas
                json[i]["Rafaga"] = json[i]["Rafaga"] - cantInstr;

                // ponemos el index donde debe iniciar el programa
                ejecutar.setIndex(inicio);
                // se pasa la informacion para que se ejcuten las instrucciones
                await ejecutar.runLineaLinea(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, inicio, cantInstr);
                // actualizamos la memoria.
                this.memoria = ejecutar.getMemory();
                json[i].Acumulador = this.memoria[0];
                if (retorno[1] === "retorne") {
                    json.shift();
                    i--;
                } else {

                    json[i].linea = retorno[1]
                    // compara la rafagas con el siguiente programa para saber si se sigue con el programa o no
                    if (json[i]["Rafaga"] > json[i + 1]["Rafaga"]) {
                        noTerminados.push(json[i]);
                        json.shift();
                        if (json.length == 1) {
                            await ejecutar.runLineaLinea(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, json[i].linea, json[i].length + 3000);
                        } else {
                            i--;
                        }
                    } else {
                        noTerminados.push(json[i + 1]);
                        json.splice(i + 1, 1);
                        if (json.length == 1) {
                            await ejecutar.runLineaLinea(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, json[i].linea, json[i].length + 3000);

                        } else {
                            i--;
                        }
                    }
                }
            }
            /*
            una vez que se ejecutaran los programas se organizan por cant de rafaga y se proceden
            a ejecutar las cantidad de lineas no ejecutadas de cada programa
            */
            noTerminados.sort(function (a, b) {
                return a.Rafaga - b.Rafaga;
            });
            for (let i = 0; i < noTerminados.length; i++) {
                // actualizamos el valor del acumulador.
                this.memoria[0] = noTerminados[i].Acumulador;
                // ejecutamos acad uno de los programas.
                await ejecutar.runLineaLinea(this.memoria, noTerminados[i].Instruccion, noTerminados[i].InfoEtiquetas, noTerminados[i].InfoVariables, noTerminados[i].linea, noTerminados[i].Instruccion.length + 300);
            }
        } else {
            for (let i = 0; i < json.length; i++) {

                let inicio = json[i].linea;

                // calculamos la cantidad de lineas que deben ejecutarse
                let cantInstr = json[i + 1].Tiemporllegada - json[i].Tiemporllegada;
                // actualizamos la cantidad de rafajas
                json[i]["Rafaga"] = json[i]["Rafaga"] - cantInstr;
                // se pasa la informacion para que se ejcuten las instrucciones
                retorno = programa.runPrograma(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, inicio, cantInstr);
                // actualizamos la memoria.
                this.memoria = retorno[0]
                json[i].Acumulador = this.memoria[0];
                if (retorno[1] === "retorne") {
                    json.shift();
                    i--;
                } else {

                    json[i].linea = retorno[1]
                    // compara la rafagas con el siguiente programa para saber si se sigue con el programa o no
                    if (json[i]["Rafaga"] > json[i + 1]["Rafaga"]) {
                        noTerminados.push(json[i]);
                        json.shift();
                        if (json.length == 1) {
                            retorno = programa.runPrograma(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, json[i].linea, json[i].length + 3000);
                        } else {
                            i--;
                        }
                    } else {
                        noTerminados.push(json[i + 1]);
                        json.splice(i + 1, 1);
                        if (json.length == 1) {
                            retorno = programa.runPrograma(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, json[i].linea, json[i].length + 3000);

                        } else {
                            i--;
                        }
                    }
                }
            }
            /*
            una vez que se ejecutaran los programas se organizan por cant de rafaga y se proceden
            a ejecutar las cantidad de lineas no ejecutadas de cada programa
            */
            noTerminados.sort(function (a, b) {
                return a.Rafaga - b.Rafaga;
            });
            for (let i = 0; i < noTerminados.length; i++) {
                // actualizamos el valor del acumulador.
                this.memoria[0] = noTerminados[i].Acumulador;
                // ejecutamos acad uno de los programas.
                programa.runPrograma(this.memoria, noTerminados[i].Instruccion, noTerminados[i].InfoEtiquetas, noTerminados[i].InfoVariables, noTerminados[i].linea, noTerminados[i].Instruccion.length + 300);
            }
        }
    }


    async RoundRobin(instrucciones, quantum, programa) {

        let ejecutar = new LineaPrueba();
        let json = []
        let retorno;
        let inicio
        // asignar la informacion a cadad uno de los programas.
        for (let i = 0; i < instrucciones.length; i++) {
            json.push({
                "Instruccion": instrucciones[i], "Rafaga": this.AsignarRafaga(instrucciones[i]), "Acumulador": 0,
                "InfoEtiquetas": this.infoEtiquetas[i], "InfoVariables": this.infoVariables[i],
                "linea": -1,
                "Index": -1
            })
        }
        // asiganar el tipo de ejecucion

        if (this.tipoEjecucion == 0) {

            for (let i = 0; i < json.length; i++) {
                inicio = json[i].linea === -1 ? json[i].linea + 1 : json[i].linea;
                //inicio = json[i].linea+1;
                //let inicio = json[i].linea;                
                if (json.length > 0) {

                    //actualizamos el valor del acumulador que tiene en el momento el programa
                    this.memoria[0] = json[i].Acumulador
                    // ponemos el index donde debe iniciar el programa
                    ejecutar.setIndex(inicio);
                    // se ejecuta el programa
                    await ejecutar.runLineaLinea(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, inicio, quantum);
                    //actualizamos la memoria.
                    this.memoria = ejecutar.getMemory();

                    if (ejecutar.getIndex() === "retorne1") {
                        //en el caso que el programa se ejecute completamente los sacasmo de la cola.
                        json.shift();
                        i--;
                    } else {
                        // actualizamos el valor del la linea en que quedo el programa
                        json[i].linea = ejecutar.getIndex();
                        // actualizamos el acumulador en que quedo el programa
                        json[i].Acumulador = this.memoria[0];
                        // se actualizan la cantida de rafagas que quedan
                        json[i].Rafaga = json[i].Rafaga - quantum;
                        // pasamos el programa a la cola
                        let temporal = json.shift();
                        json.push(temporal)
                        i--;
                    }
                }
            }

        } else {
            for (let i = 0; i < json.length; i++) {
                inicio = json[i].linea === -1 ? json[i].linea + 1 : json[i].linea;

                if (json.length > 0) {
                    // actualizacion del valor en la memoria.
                    this.memoria[0] = json[i].Acumulador
                    // ejecucion del programa
                    retorno = programa.runPrograma(this.memoria, json[i].Instruccion, json[i].InfoEtiquetas, json[i].InfoVariables, inicio, quantum);

                    // actualizamos los valores de la memoria.
                    this.memoria = retorno[0];

                    if (retorno[1] === "retorne") {
                        // sacamos de la lista el programa que se ejecuto por completo.
                        json.shift();
                        i--;
                    } else {
                        // actualizar la linea en que quedo en ejecucion el programa.
                        json[i].linea = retorno[1]
                        // actualizamos el valor del acumulador en que quedo el programa.
                        json[i].Acumulador = this.memoria[0];
                        // actualizacion cantida de rafagas.
                        json[i].Rafaga = json[i].Rafaga - quantum;
                        // pasamo el programa a la cola.
                        let temporal = json.shift();
                        json.push(temporal)
                        i--;
                    }
                }
            }
        }
    }
}