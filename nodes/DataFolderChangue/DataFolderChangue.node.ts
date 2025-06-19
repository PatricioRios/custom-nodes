import {
    //  	IDataObject,
        INodeType,
        INodeTypeDescription,
        NodeConnectionType,
        ITriggerFunctions,
        ITriggerResponse,
        INodeProperties,
    //    IRequestOptions
    } from 'n8n-workflow';

import { spawn } from 'child_process';


export class DataFolderChangue implements INodeType {
    description: INodeTypeDescription = this.getDescription();

//    async trigger(this: ITriggerFunctions): Promise<ITriggerResponse | undefined> {
//        const folderPath = this.getNodeParameter(DataFolderChangue.PROPERTIES.FOLDER_PATH) as string;
//        const fileContent = this.getNodeParameter(DataFolderChangue.PROPERTIES.FILE_CONTENT) as boolean;
//        const maxFileContentLength = this.getNodeParameter(DataFolderChangue.PROPERTIES.MAX_FILE_CONTENT_LENGHT) as number;
//
//    }

// This is another approach that's even more directly based on the n8n example

async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
    const folderPath = this.getNodeParameter(DataFolderChangue.PROPERTIES.FOLDER_PATH) as string;
    const includeFileContent = this.getNodeParameter(DataFolderChangue.PROPERTIES.FILE_CONTENT) as boolean;
    var maxFileContentLength: number = 0;
    if (includeFileContent) {
        maxFileContentLength = this.getNodeParameter(DataFolderChangue.PROPERTIES.MAX_FILE_CONTENT_LENGHT) as number;
    }
    // El comando es fijo: "watchdir"
    const commandPath = "/home/pato/.local/bin/watchdir"; 
    const args = includeFileContent 
        ? [maxFileContentLength.toString(), folderPath]
        : ["0", folderPath];

    this.logger.debug(`Executing watchdir command: ${commandPath} ${args.join(' ')}`);
    const watchProcess = spawn(commandPath, args);

    // Create a simple function to execute the trigger, exactly like in the example
    const executeTrigger = (filePath: string, fileContent: string) => {
        
        // Use the EXACT SAME structure as the example node
        const data = { 
            event: 'added', 
            path: filePath,
            content_only: includeFileContent ? true : false,
            content: includeFileContent ? fileContent : undefined
        };
        
        this.logger.debug('Emitting event:', data);
        // Use the EXACT SAME emit pattern as the example node
        this.emit([this.helpers.returnJsonArray([data])]);
    };
    
    // Listen for data from the watchdir process
    watchProcess.stdout.on('data', (data) => {
        const output = data.toString().trim();
        this.logger.debug('Received output from watchdir process:', output);

        // Parse the output and trigger an event
        const match = output.match(/^"([^"]+)"\s+"([^"]+)"$/);
        if (match) {
            const filePath = match[1];
            let fileContent = match[2];
            
            if (fileContent.length > maxFileContentLength) {
                fileContent = fileContent.substring(0, maxFileContentLength);
            }
            
            executeTrigger(filePath, fileContent);
        }
    });

    // Handle process errors
    watchProcess.stderr.on('data', (data) => {
        this.logger.error('Error from watchdir process:', data.toString());
    });

    // Create a close function that terminates the process
    async function closeFunction() {
        if (watchProcess && !watchProcess.killed) {
            watchProcess.kill();
        }
    }   

    // Return ONLY the closeFunction, exactly like in the example
    return {
        closeFunction,
    };
    }       

    static readonly PROPERTIES = {
        FOLDER_PATH: 'FOLDER_PATH', 
        FILE_CONTENT: 'FILE_CONTENT',
        MAX_FILE_CONTENT_LENGHT: 'MAX_FILE_CONTENT_LENGHT',
    } as const;

    getDescription(): INodeTypeDescription {
        return {
            displayName: 'Data Folder Changue',
            name: 'dataFolderChangue',
            icon: 'file:DataFolderChangueIcon.svg',
            group: ['trigger'],//indica que es un trigger
            version: 1.0,
            description: 'Cada vez que se añade un nuevo archivo en una carpeta, se ejecuta el flujo',
            defaults: {
                name: 'Folder Changue',
            },
            inputs: [],
            outputs: [NodeConnectionType.Main],
            properties: this.getProperties()
        }
    }
    getProperties(): INodeProperties[]{
        return [
            {
                displayName: 'Folder Path',
                name: DataFolderChangue.PROPERTIES.FOLDER_PATH,
                type: 'string',
                default: '/home/pato/Descargas/Vivaldi',
                placeholder: '/home/user/Downloads',
                required: true,
                description: 'Path de la carpeta a observar',
            },
            {
                displayName: 'Include File Content',
                name: DataFolderChangue.PROPERTIES.FILE_CONTENT,
                type: 'boolean',
                default: false,    
            },
            {
                displayName:'File Max Content Length', 
                name:DataFolderChangue.PROPERTIES.MAX_FILE_CONTENT_LENGHT,
                description:'Maximo de caracteres a leer del archivo', 
                type:'number', 
                default:'255',  
                displayOptions:{
                    show:{
                        [DataFolderChangue.PROPERTIES.FILE_CONTENT]:[true],
                    }
                }
            },
        ]
    } 
}



