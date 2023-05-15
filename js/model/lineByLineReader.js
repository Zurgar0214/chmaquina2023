export class LineaPrueba {

    index = 0;
    instrucciones = []
    infEtiq = []
    infVariable = []
    memory = []
    cantidadLinea = 0;

    async runLineaLinea(memoria, instrucciones, infEtiq, infVariable, lineaInicio, lineasAEjecutar) {
        this.index = lineaInicio;
        this.instrucciones = instrucciones;
        this.infEtiq = infEtiq
        this.infVariable = infVariable
        this.memory = memoria

        // Condicional para definir el inicio del ciclo
        this.index > 0 ? this.cantidadLinea = -1 : this.cantidadLinea = 0;

        let valorButton = document.getElementById("nextButton")

        const box = document.getElementById("box");
        if (this.index == 0) {
            this.showElement(this.memory, this.instrucciones, this.infEtiq, this.infVariable, this.index);
        }

        await new Promise((resolve) => {
            valorButton.addEventListener("click",
                (e) => {
                    e.preventDefault();
                    if (this.index >= this.instrucciones.length - 1 || this.cantidadLinea == lineasAEjecutar || this.index == "retorne1") {

                        this.cantidadLinea = -1;
                        resolve();
                    } else {
                        this.showElement(this.memory, this.instrucciones, this.infEtiq, this.infVariable, this.index);
                        this.index = this.index + 1;
                    }
                });
            return [this.memory, this.index];
        });
    }

    getMemory() {
        return this.memory;
    }

    getIndex() {
        return this.index;
    }

    setIndex(index) {
        this.index = index;
    }

    showElement(memory, runinstrc, infEtiq, infVariable, posicion) {
        box.innerHTML = runinstrc[posicion];
        this.runPrograma(memory, runinstrc, infEtiq, infVariable, posicion);
    }

    runPrograma(memory, runinstrc, infEtiq, infVariable, posicion) {
        let operaNumeros = ["sume", "reste",
            "multiplique",
            "divida", "potencia",
            "modulo"];
        let instruc = ["cargue", "almacene",
            "lea", "muestre",
            "imprima"];

        let logicas = ["Y", "O", "NO"];
        let operaString = ["concatene", "elimine", "extraiga"];

        let ciclos = ["vaya", "vayasi"]
        box.innerHTML = runinstrc[posicion];

        let i = posicion
        let inst = runinstrc[i].split(" ");

        // Condicional para saltar las líneas que no cuentan para la ráfaga
        if (inst[0] != "nueva" && inst[0] != "etiqueta" && inst[0] != "retorne" && inst[0] != "//") {
            this.cantidadLinea++
        }

        if ((i[0] == '/' && i[1] != '/')) { }

        else if (inst[0] === "retorne") {
            memory[0] = 0;
            this.index = inst[0]
            return
        }

        else if (operaNumeros.includes(inst[0])) {
            let result = this.funOperNum(runinstrc[i], memory, infVariable)
            memory = result[0];
            infVariable = result[1];
        }

        else if (logicas.includes(inst[0])) {
            let result = this.funLogic(runinstrc[i], memory, infVariable)
            memory = result[0];
            infVariable = result[1];
        }

        else if (ciclos.includes(inst[0])) {
            if (inst[0] === "vaya") {
                let jsonEtiqueta = infEtiq.filter(elemento => elemento.nombre === inst[1]);
                if (jsonEtiqueta.length === 0) {
                    throw new Error(`la etiqueta al que se desea acceder no existe`);
                } else {
                    i = parseInt(jsonEtiqueta[0].posicionInstrucciones) - 1;
                    this.index = i;
                }

            }

            if (inst[0] === "vayasi") {
                let jsonEtiquetaUno = infEtiq.filter(elemento => elemento.nombre === inst[1]);
                let jsonEtiquetaDos = infEtiq.filter(elemento => elemento.nombre === inst[2]);
                if (jsonEtiquetaUno.length === 0 || jsonEtiquetaDos.length === 0) {
                    throw new Error(`la etiqueta al que se desea acceder no existe`);
                } else {
                    if (memory[0] == 0) {
                        i = i - 1;
                    }
                    else if (memory[0] > 0) {
                        i = parseInt(jsonEtiquetaUno[0].posicionInstrucciones) - 2;
                        this.index = i;
                    }
                    else if (memory[0] < 0) {
                        i = parseInt(jsonEtiquetaUno[0].posicionInstrucciones) - 2;
                        this.index = i;
                    }
                }

            }

        }
        else if (instruc.includes(inst[0])) {
            let result = this.funInstruc(runinstrc[i], memory, infVariable)
            memory = result[0];
            infVariable = result[1];
        }
        else if (operaString.includes(inst[0])) {
            let result = this.funOperNum(runinstrc[i], memory, infVariable)
            memory = result[0];
            infVariable = result[1];
        }
        return
    }

    funOperNum(instruccion, memory, infVariable) {

        let retunrCambios = []
        let inst = instruccion.split(" ");
        let jsonVariable = []
        let nombreVariable
        switch (inst[0]) {
            case "sume":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea sumar no existe`);
                } else {
                    memory[0] = memory[0] + jsonVariable[0].valor
                }

                break;
            case "reste":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea sumar no existe`);
                } else {
                    memory[0] = memory[0] - jsonVariable[0].valor
                }
                break;
            case "multiplique":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea sumar no existe`);
                } else {
                    memory[0] = memory[0] * jsonVariable[0].valor
                }
                break;
            case "divida":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea dividir no existe`);
                } else {
                    if (jsonVariable[0].valor == 0) {
                        throw new Error(`No es posible hacer division por cero`);
                    }
                    else {
                        memory[0] = memory[0] / jsonVariable[0].valor
                    }

                }
                break;
            case "potencia":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea hacer potencia no existe`);
                } else {
                    memory[0] = memory[0] ** jsonVariable[0].valor
                }
                break;
            case "modulo":
                let valor = parseInt(inst[1])
                if (!isNaN(valor)) {
                    memory[0] = memory[0] % inst[1];
                } else {
                    throw new Error(`el parametro pasado a la funcion "modulo" no es valido`);
                }
                break;
            default:
                console.log("No es una instruccion valida");
                break;
        }
        retunrCambios.push(memory)
        retunrCambios.push(infVariable)

        return retunrCambios;

    }

    funInstruc(instruccion, memory, infVariable) {
        let retunrCambios = []
        let inst = instruccion.split(" ");
        let jsonVariable = []
        let nombreVariable
        switch (inst[0]) {
            case "cargue":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea cargar no existe`);
                } else {
                    memory[0] = jsonVariable[0].valor
                    document.getElementById('acumulador-value').innerHTML = memory[0]
                }

                break;
            case "almacene":
                console.log("entro alamacene infoVariables---->", infVariable)
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable en la que se desea almacenar no existe`);
                } else {
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === nombreVariable);
                    cambioInfo.valor = memory[0];
                    memory[cambioInfo.posicion] = memory[0]
                }
                break;
            case "lea":
                nombreVariable = inst[1]
                let valorVariable = prompt(`Ingrese el valor para la variable ${nombreVariable}`);
                const cambioInfo = infVariable.find(elemento => elemento.nombre === nombreVariable);
                switch (cambioInfo.tipo) {
                    case "I":
                        try {
                            valorVariable = parseInt(valorVariable);
                        } catch (error) {
                            throw new Error(`la variable no es del tipo esperado`);
                        }


                        break;
                    case "R":
                        try {
                            valorVariable = parseFloat(valorVariable);
                        } catch (error) {
                            throw new Error(`la variable no es del tipo esperado`);
                        }

                        break;
                    case "B":
                        if (valorVariable == "1" || valorVariable == "true") {
                            valorVariable = true;
                        }
                        else if (valorVariable == "0" || valorVariable == "false") {
                            valorVariable = false;
                        } else {
                            throw new Error(`la variable no es del tipo esperado`);
                        }
                        break;
                    default:
                        break;
                }
                cambioInfo.valor = valorVariable;
                let posicionMemoria = cambioInfo.posicion;
                memory[posicionMemoria] = valorVariable;
                break;
            case "muestre":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable que se desea cargar no existe`);
                } else {
                    document.getElementById('screen-container').innerHTML = `<p class="text-box-fixed">${jsonVariable[0].valor}</p>`
                }
                break;
            case "imprima":
                nombreVariable = inst[1]
                jsonVariable = infVariable.filter(elemento => elemento.nombre === nombreVariable);
                if (jsonVariable.length === 0) {
                    throw new Error(`la variable no existe`);
                } else if (jsonVariable.length === 0){
                    throw new Error(`la variable no existe`);
                }else{
                    document.getElementById('printer-container').innerHTML = `<p>${jsonVariable[0].valor}</p>`
                }
                break;
            default:
                console.log("No es una instruccion valida");
                break;
        }
        retunrCambios.push(memory)
        retunrCambios.push(infVariable)
        return retunrCambios;
    }

    funLogic(instruccion, memory, infVariable) {
        let retunrCambios = []
        let inst = instruccion.split(" ");
        let jsonVariableUno = [];
        let jsonVariableDos = [];
        let jsonVariableRespuesta = [];
        if (inst[0] === "NO") {
            jsonVariableUno = infVariable.filter(elemento => elemento.nombre === inst[1]);
            jsonVariableDos = infVariable.filter(elemento => elemento.nombre === inst[2]);
        } else {
            jsonVariableUno = infVariable.filter(elemento => elemento.nombre === inst[1]);
            jsonVariableDos = infVariable.filter(elemento => elemento.nombre === inst[2]);
            jsonVariableRespuesta = infVariable.filter(elemento => elemento.nombre === inst[3]);
        }

        switch (inst[0]) {
            case "Y":

                if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0 || jsonVariableRespuesta.length === 0) {
                    throw new Error(`alguna de las variables no se encuentra creada`);
                } else {
                    let operacion = jsonVariableUno[0].valor & jsonVariableDos[0].valor
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[3]);
                    cambioInfo.valor = operacion;
                }
                break;
            case "O":
                if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0 || jsonVariableRespuesta.length === 0) {
                    throw new Error(`alguna de las variables no se encuentra creada`);
                } else {
                    let operacion = jsonVariableUno[0].valor || jsonVariableDos[0].valor
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[3]);
                    cambioInfo.valor = operacion;
                }
                break;
            case "NO":
                if (jsonVariableUno.length === 0 || jsonVariableDos.length === 0) {
                    throw new Error(`alguna de las variables no se encuentra creada`);
                } else {
                    let operacion = !jsonVariableUno[0].valor
                    const cambioInfo = infVariable.find(elemento => elemento.nombre === inst[2]);
                    cambioInfo.valor = operacion;
                }
                break;
            default:
                break;
        }
        retunrCambios.push(memory)
        retunrCambios.push(infVariable)

        return retunrCambios;

    }

    funOperStr(instruccion, memory) {

        let inst = instruccion.split(" ");

        // extraer el valor que viene en el acomulador hasta el momento
        let valorAcumulador = memory[0];
        // valor de la instruccion
        let valorInstruc = inst[1];
        // guardar el resultado de la operación.
        let resultado;
        switch (inst[0]) {
            case "concatene":
                // resultado
                resultado = valorAcumulador + valorInstruc;

                break;

            case "elimine":
                let string = this.acumulador;
                let substringsToRemove = [valorInstruc];

                let regex = new RegExp(substringsToRemove.join("|"), "g");

                resultado = string.replace(regex, "");

                break;
            case "extraiga":
                // extraer de la instruccion la cantidad de caracteres a extraer
                let cantCarac = parseInt(valorInstruc)
                if (!isNaN(cantCarac)) {
                    resultado = valorAcumulador.substring(0, cantCarac);

                } else {
                    throw new Error(`el parametro pasado a la funcion "extraiga" no es valido`);
                }

                break;

            default:
                break;
        }
        // cambiamos el valor del acumulador en la memoria
        memory[0] = resultado;
        document.getElementById('acumulador-value').innerHTML = memory[0];
        return memory
    }

}