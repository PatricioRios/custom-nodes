import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class ExampleNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Example Node',
		name: 'ExampleNode',        
		group: ['transform'],
		version: 1.0,
		description: 'An example node showcasing all property types',
		defaults: {
			color: '#FF0000',
            name: 'Example Node',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			// Basic
			{
				displayName: 'My String',
				name: 'myString',
				type: 'string',
				default: '',
				description: 'A simple text input',
			},
			{
				displayName: 'My Number',
				name: 'myNumber',
				type: 'number',
				default: 0,
				description: 'A numerical input',
			},
			{
				displayName: 'My Boolean',
				name: 'myBoolean',
				type: 'boolean',
				default: false,
				description: 'A true/false switch',
			},
			{
				displayName: 'My DateTime',
				name: 'myDateTime',
				type: 'dateTime',
				default: '',
				description: 'A date and time picker',
			},
			{       
				displayName: 'My JSON',
				name: 'myJson',
				type: 'json',
				default: '{}',
				description: 'A JSON object input',
			},
			{
				displayName: 'My Options Single',
				name: 'myOptionsSingle',
				type: 'options',
				options: [
					{
						name: 'Option A',
						value: 'optionA',
					},
					{
						name: 'Option B',
						value: 'optionB',
					},
					{
						name: 'Option C',
						value: 'optionC',
					},
				],
				default: 'optionA',
				description: 'A single select dropdown',
			},
			{
				displayName: 'My Options Multiple',
				name: 'myOptionsMultiple',
				type: 'multiOptions',
				options: [
					{
						name: 'Option X',
						value: 'optionX',
					},
					{
						name: 'Option Y',
						value: 'optionY',
					},
					{
						name: 'Option Z',
						value: 'optionZ',
					},
				],
				default: ['optionX'],
				description: 'A multi-select dropdown',
			},
			{
				displayName: 'My Collection',
				name: 'myCollection',
				type: 'collection',
				placeholder: 'Add New Item',
				default: [
					{
						stringProperty: 'default value',
						numberProperty: 123,
					},
				],
				description: 'A collection of structured data',
				options: [
					{
						displayName: 'String Property',
						name: 'stringProperty',
						type: 'string',
						default: '',
						description: 'A string property within the collection',
					},
					{
						displayName: 'Number Property',
						name: 'numberProperty',
						type: 'number',
						default: 0,
						description: 'A number property within the collection',
					},
				],
			},

			{
				displayName: 'My Color',
				name: 'myColor',
				type: 'color',
				default: '#ff0000',
				description: 'A color picker',
			},
			{
				displayName: 'My Hidden Property',
				name: 'myHiddenProperty',
				type: 'hidden',
				default: 'hiddenValue',
			},
		],
	};

	async execute() {
		// Your node's logic will go here
		return [];
	}
}