export class Validation {  
    constructor(fileContent=[]) {
        this.fileContent = fileContent;
    }
    validComments() {
        let filewhitout = []
        this.fileContent = this.fileContent.filter((line) => {

            if (!(line[0] == '/' && line[1] == '/')) {
                filewhitout.push(line)
            }
            
            
        })
        return filewhitout
    }

    validSintaxis(){
        let reservadas = ["sume","reste",
                        "multiplique",
                        "divida","potencia",
                        "modulo","Y","O","NO",
                        "concatene","elimine","extraiga",
                        "cargue","almacene",
                        "nueva", "lea","muestre",
                        "imprima", "retorne","etiqueta",
                        "vaya","vayasi"
                        ]
        let tipoVariable = ["I","L","R","C"]
        let  instructions = this.fileContent

        instructions.forEach(function(line) {


            let inst =  line.split(" ");
            let tamaño = inst.length

            if ((line[0] == '/' && line[1] == '/')){
            }
            else if ((line[0] == '/')) {
                const evenIndex = instructions.indexOf(line);
                throw new Error(`Se encuentra un error syntactico en la linea ${evenIndex+1}`);
            }
            
            else if ( reservadas.indexOf(inst[0])===-1 || (tamaño ===1 & inst[0] != "retorne" )) {
                const evenIndex = instructions.indexOf(line);            
                throw new Error(`error la linea ${evenIndex+1} no contiene ninguna instrucción `);
            }

            const indices = [];

            for (let i = 0; i < inst.length; i++) {
            const index = reservadas.indexOf(inst[i]);
            if (index !== -1) {
                indices.push({ valor: inst[i], posicion: i });
            }
            }           

            if (indices.length>1) {
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error sintáctico existen dos instruciones en una misma linea ${evenIndex+1}`);
            }
            
            if (inst[0]=="nueva" & tipoVariable.indexOf(inst[2])===-1){
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error sintáctico tipo de varible no reconocida ${evenIndex+1}`);
            }
            if ((inst[0]=="nueva" & tipoVariable.indexOf(inst[2])===-1) || (inst[0]=="nueva" & inst.length<3 )){
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error sintáctico tipo de varible no reconocida ${evenIndex+1}`);
            }

            if ((inst[0]=="etiqueta" & inst.length<3)){
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error sintáctico la instruccion etiqueta no esta completa ${evenIndex+1}`);
            }

            if(inst[2] <0 || inst[2]>instructions.length ){
                const evenIndex = instructions.indexOf(line);             
                throw new Error(`error sintáctico la etiqueta no se puede signar ${evenIndex+1}`);
            }

        });
        instructions = this.validComments() 

        return instructions;

    }
}