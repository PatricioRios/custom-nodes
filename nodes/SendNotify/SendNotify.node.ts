import {
    //  	IDataObject,
        INodeType,
        INodeTypeDescription,
        NodeConnectionType,
        INodeProperties,
        IExecuteFunctions,
        INodeExecutionData,
    //    IRequestOptions
    } from 'n8n-workflow';

    import { exec } from 'child_process';



export class SendNotify implements INodeType {
    description: INodeTypeDescription = this.getDescription();

    
    
    static readonly PROPERTIES = {
        TITLE: 'TITLE', 
        MESSAGE: 'MESSAGE',
        URGENCY: 'URGENCY',
        ICON: 'ICON',
        USE_ICON: 'USE_ICON',
        APP_NAME: 'APP_NAME'
    } as const;

    static readonly URGENCY_LEVEL = {
        LOW: 'low', 
        NORMAL: 'normal',
        CRITICAL: 'critical',
    } as const;

    
    

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const title = this.getNodeParameter(SendNotify.PROPERTIES.TITLE, 0) as string;
        const message = this.getNodeParameter(SendNotify.PROPERTIES.MESSAGE, 0) as string;
        const urgency = this.getNodeParameter(SendNotify.PROPERTIES.URGENCY, 0) as string;
        const appName = this.getNodeParameter(SendNotify.PROPERTIES.APP_NAME, 0) as string;
        const useIcon = this.getNodeParameter(SendNotify.PROPERTIES.USE_ICON, 0) as boolean;

        // Comando base
        let command = `notify-send -u ${urgency} --hint=string:desktop-entry:${appName} "${title}" "${message}"`;

        // Añadir ícono si es necesario
        if (useIcon) {
            const icon = this.getNodeParameter(SendNotify.PROPERTIES.ICON, 0) as string;
            command += ` -i "${icon}"`;
        }

        // Ejecutar el comando
        exec(command, (error) => {
            if (error) console.error("Error:", error);
        });

        return this.prepareOutputData([]);
    }
    getDescription(): INodeTypeDescription {
        return {
            displayName: 'Notify Sender',
            name: 'notifySender',
            icon: 'file:SendNotify.svg',
            group: ['transform'],
            version: 1.0,
            description: 'Con este nodo es posible enviar notificaciones a el sistema operativo',
            defaults: {
                name: 'Notify Sender',
            },
            inputs: [NodeConnectionType.Main],
            outputs: [NodeConnectionType.Main],
            properties: this.getProperties()
        }
    }
    
    getProperties(): INodeProperties[]{
        return [
            {
                displayName: 'App Name',
                name: SendNotify.PROPERTIES.APP_NAME,
                type: 'string',
                default: 'n8n',
                placeholder: 'your app name',
                required: true,
                description: 'Nombre de la aplicacion que va a enviar la notificacion',
            },
            {
                displayName: 'Titutlo',
                name: SendNotify.PROPERTIES.TITLE,
                type: 'string',
                default: 'Ejemplo de notificacion',
                placeholder: 'Titulo de la notificacion',
                required: true,
                description: 'Titulo de la notificacion',
            },
            {
                displayName: 'Message',
                name: SendNotify.PROPERTIES.MESSAGE,
                type: 'string',
                default: 'Ejemplo de notificacion',
                placeholder: 'Contenido de la notificacion',
                required: true,
                description: 'Mensaje de la notificacion',
            },
            { 
                displayName:'Urgency', 
                name:SendNotify.PROPERTIES.URGENCY,
                description:'Urgency of the notification', 
                type:'options', 
                default:'low',
                options: [
                    {
                        name: 'Low',
                        value: SendNotify.URGENCY_LEVEL.LOW,
                    },
                    {
                        name: 'Normal',
                        value: SendNotify.URGENCY_LEVEL.NORMAL,
                    },
                    {
                        name: 'Critial',
                        value: SendNotify.URGENCY_LEVEL.CRITICAL,
                    },
                ],
            },
            {
                displayName: 'Use custom icon',
                name: SendNotify.PROPERTIES.USE_ICON,
                type: 'boolean',
                default: false,    
            },
            {
                displayName:'Icon', 
                name:SendNotify.PROPERTIES.ICON,
                description:'Icono que va a tener la notificaicon', 
                type:'string', 
                default:'',  
                displayOptions:{
                    show:{
                        [SendNotify.PROPERTIES.USE_ICON]:[true],
                    }
                }
            }
        ]
    } 
}



