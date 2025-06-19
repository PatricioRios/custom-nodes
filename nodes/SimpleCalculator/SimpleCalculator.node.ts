
import {
//  	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
    NodeConnectionType
//    IRequestOptions
} from 'n8n-workflow';


import { exec, ExecException } from 'child_process';
import { promisify } from 'util';

// Promisify la función exec para manejarla con async/await
const execPromise = promisify(exec);


export class SimpleCalculator implements INodeType {
	description: INodeTypeDescription = this.getDescription();
    // Define el nombre del nodo
                nodeTypeName: string = 'SimpleCalculator';
    // Define la versión del nodo
    nodeVersion: string = '1.0';

    // Constructor de la clase
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
       // Handle data coming from previous nodes
       let responseData;
       const returnData = [];
       const resource = this.getNodeParameter('operation', 0) as string;
       const operands = this.getNodeParameter('cantidad_operandos', 0) as string;


       switch (resource) {
           case 'sumar':
               if (operands === 'dos') {
                   const operandoUno = this.getNodeParameter('operando_uno', 0) as number;
                   const operandoDos = this.getNodeParameter('operando_dos', 0) as number;
                   responseData = await operar(OPERATION.Sumar,operandoUno, operandoDos, 0);
               }
               if (operands === 'tres') {
                   const operandoUno = this.getNodeParameter('operando_uno', 0) as number;
                   const operandoDos = this.getNodeParameter('operando_dos', 0) as number;
                   const operandoTres = this.getNodeParameter('operando_tres', 0) as number;
                   responseData = await operar(OPERATION.Sumar,operandoUno, operandoDos, operandoTres);
               }
               break;
           case 'restar':
               if (operands === 'dos') {
                   const operandoUno = this.getNodeParameter('operando_uno', 0) as number;
                   const operandoDos = this.getNodeParameter('operando_dos', 0) as number;
                   responseData = await operar(OPERATION.Restar,operandoUno, operandoDos, 0);

               }
               if (operands === 'tres') {
                   const operandoUno = this.getNodeParameter('operando_uno', 0) as number;
                   const operandoDos = this.getNodeParameter('operando_dos', 0) as number;
                   const operandoTres = this.getNodeParameter('operando_tres', 0) as number;
                   responseData = await operar(OPERATION.Restar,operandoUno, operandoDos, operandoTres);
               }
               break;
           case 'multiplicar':
               if (operands === 'dos') {
                   const operandoUno = this.getNodeParameter('operando_uno', 0) as number;
                   const operandoDos = this.getNodeParameter('operando_dos', 0) as number;
                   responseData = await operar(OPERATION.Multiplicar,operandoUno, operandoDos, 1);

               }
               if (operands === 'tres') {
                   const operandoUno = this.getNodeParameter('operando_uno', 0) as number;
                   const operandoDos = this.getNodeParameter('operando_dos', 0) as number;
                   const operandoTres = this.getNodeParameter('operando_tres', 0) as number;
                   responseData = await operar(OPERATION.Multiplicar,operandoUno, operandoDos, operandoTres);
               }
               break;
           default:
               throw new Error(`The resource "${resource}" is not supported.`);
            }

         // Map data to n8n data structure
        returnData.push({
            result: responseData,
        });
        return [this.helpers.returnJsonArray(returnData)];
    }

    getDescription(): INodeTypeDescription {
        return {
            displayName: 'SimpleCalculator',
            name: 'calculator',
            icon: 'file:SimpleCalculator.svg',
            group: ['transform'],
            version: 1.1,
            description: 'aplicar un un calculo (suma, resta, multiplicacion) de dos o tres numeros',
            defaults: {
                name: 'Simple Calculator',
            },  
            inputs: [NodeConnectionType.Main],
            outputs: [NodeConnectionType.Main],
            properties: [
                       {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Sumar',
                            value: 'sumar',
                        },
                        {
                            name: 'Restar',
                            value: 'restar',
                        },
                        {
                            name: 'Multiplicar',
                            value: 'multiplicar',
                        },
                    ],
                    default: '',
                    noDataExpression: true,
                    required: true,
                    description: 'Create a new contact',
                },
                {
                    displayName: 'Cantidad de Operarandos',
                    name: 'cantidad_operandos',
                    type: 'options',    
                    options: [
                        {
                            name: '2 Operando',
                            value: 'dos',
                            description: 'utilizar 2 operando',
                            action: 'utilizar 2 operando',
                        },
                        {
                            name: '3 Operando',
                            value: 'tres',
                            description: 'utilizar 3 operando',
                            action: 'utilizar 3 operando',
                        },
                    ],
                    default: 'dos',
                    required:true,
                    description: 'Cantidad de operandos a utilizar',
                },
                {
                    displayName: 'Operando 1',
                    name: 'operando_uno',
                    type: 'number',
                    required: true,
                    displayOptions: {
                        show: {
                            cantidad_operandos: [
                                'dos',
                                'tres',
                            ]
                        },
                    },
                    default:'',
                    placeholder: '0',
                    description:'Primer operando para la operacion',
                },
                {
                    displayName: 'Operando 1',
                    name: 'operando_dos',
                    type: 'number',
                    required: true,
                    displayOptions: {
                        show: {
                            cantidad_operandos: [
                                'dos',
                                'tres',
                            ]
                        },
                    },
                    default:'',
                    placeholder: '0',
                    description:'Segundo operando para la operacion',
                },
                {
                    displayName: 'Operando 3',
                    name: 'operando_tres',
                    type: 'number',
                    required: true,
                    displayOptions: {   
                        show: {
                            cantidad_operandos: [
                                'tres',
                            ],
                        },
                    },
                    default:'',
                    placeholder: '0',
                    description:'Tercer operando para la operacion',
                },
            ],
        };
    }

}
const enum OPERATION {
    Sumar = '+',
    Restar = '-',
    Multiplicar = 'm'
};

async function operar(operation : OPERATION, num1: number, num2: number, num3: number): Promise<number> {
    // IMPORTANTE: Reemplaza './sumar' con la ruta real a tu ejecutable.
    // Si 'sumar' está en el PATH de tu sistema, puedes usar solo 'sumar'.
    // Si está en el mismo directorio que tu script Node.js, usa './sumar'.
    // Si está en otro lugar, usa la ruta completa como '/home/tuusuario/ruta/a/sumar'.
    const executablePath: string = 'sumar';
    console.log(`Ejecutando el comando: ${executablePath} ${operation} ${num1} ${num2} ${num3}`);

    const command: string = `${executablePath} ${operation} ${num1} ${num2} ${num3}`;


    try {
        // Ejecuta el comando y espera la salida
        const { stdout, stderr } = await execPromise(command);

        // Verifica si hubo salida de error estándar
        if (stderr) {
            console.error(`Stderr del script Rust: ${stderr}`);
            // Decide si stderr indica un error fatal o solo una advertencia.
            // Para este caso simp      le, procederemos si stdout es un número válido.
        }

        console.error(`Stdout del script Rust: ${stdout}`);
        console.error(`Stderr del script Rust: ${stderr}`);

        // El script Rust imprime la suma a stdout, seguido de un salto de línea.
        // Elimina espacios en blanco (incluyendo el salto de línea) y parsea como entero.
        const sumString: string = stdout.trim();
        const sum: number = parseInt(sumString, 10); // Siempre especifica la base 10

        // Verifica si el resultado parseado es un número válido
        if (isNaN(sum)) {
             console.error(`Error: El script Rust no devolvió un número válido. Salida cruda: "${stdout}"`);
             throw new Error('Salida inválida del script Rust.');
        }
        console.log(`Resultado de la suma: ${sum}`);

        return sum;

    } catch (error: unknown) { // Usa 'unknown' para un manejo más seguro de errores
        let errorMessage = 'Ocurrió un error desconocido al ejecutar el script Rust.';
        if (error instanceof Error) {
            errorMessage = `Fallo al ejecutar el script Rust: ${error.message}`;
            // Si el error es de tipo ExecException, puedes acceder a stderr, stdout, etc.
            const execError = error as ExecException;
             if (execError.stderr) {
                console.error(`Stderr asociado al error: ${execError.stderr}`);
             }
        } else if (typeof error === 'string') {
             errorMessage = `Fallo al ejecutar el script Rust (mensaje string): ${error}`;
        }

        console.error(errorMessage);
        // Relanza el error para que el llamador pueda manejarlo si es necesario
        throw error;
    }
}
