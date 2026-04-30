export let nodeInfo: {
	[key: string]: {
		description: string;
		nInputs: number;
		truthTable?: number[][][];
		inputList: string[];
		outputList: string[];
	};
} = {
	AND: {
		description: 'The AND Gate only activates if both its inputs are on.',
		nInputs: 2,
		truthTable: [
			[[0, 0], [0]],
			[[0, 1], [0]],
			[[1, 0], [0]],
			[[1, 1], [1]]
		],
		inputList: ['Input 1', 'Input 2'],
		outputList: ['Output']
	},
	OR: {
		description: 'The OR Gate activates if at least one of its inputs is on.',
		nInputs: 2,
		truthTable: [
			[[0, 0], [0]],
			[[0, 1], [1]],
			[[1, 0], [1]],
			[[1, 1], [1]]
		],
		inputList: ['Input 1', 'Input 2'],
		outputList: ['Output']
	},

	NOT: {
		description: 'The NOT Gate activates only if the input is off. It acts as an inverter.',
		nInputs: 1,
		truthTable: [
			[[0], [1]],
			[[1], [0]]
		],
		inputList: ['Input'],
		outputList: ['Output']
	},
	XOR: {
		description:
			'The XOR (Exclusive OR) Gate activates only if an odd number of inputs are on. Here, it only turns on if exactly one input is on.',
		nInputs: 2,
		truthTable: [
			[[0, 0], [0]],
			[[0, 1], [1]],
			[[1, 0], [1]],
			[[1, 1], [0]]
		],
		inputList: ['Input 1', 'Input 2'],
		outputList: ['Output']
	},
	NAND: {
		description: 'The NAND (Not AND) Gate activates if at least one of its inputs are off.',
		nInputs: 2,
		truthTable: [
			[[0, 0], [1]],
			[[0, 1], [1]],
			[[1, 0], [1]],
			[[1, 1], [0]]
		],
		inputList: ['Input 1', 'Input 2'],
		outputList: ['Output']
	},
	NOR: {
		description: 'The NOR (Not OR) Gate activates only if both of its inputs are off.',
		nInputs: 2,
		truthTable: [
			[[0, 0], [1]],
			[[0, 1], [0]],
			[[1, 0], [0]],
			[[1, 1], [0]]
		],
		inputList: ['Input 1', 'Input 2'],
		outputList: ['Output']
	},
	'Single Readout': {
		description:
			'The Single Readout has exactly one input, and it simply shows you if it is on or off.',
		nInputs: 1,
		inputList: ['Input 1'],
		outputList: []
	},
	'Toggle Button': {
		description: 'A versatile input node that is used if you need a constant on or off signal.',
		nInputs: 1,
		inputList: ['Input 1'],
		outputList: []
	},
	'Half-Bit Adder': {
		description:
			'The basic component of addition. Outputs a SUM and a CARRY. The SUM is the binary addition of the two input bits, and the CARRY bit is on if arithmetic "carry" takes place, i.e., the number in the next digits place is a 1.',
		inputList: ['Input 1', 'Input 2'],
		outputList: ['Sum', 'Carry'],
		nInputs: 2,
		truthTable: [
			[
				[0, 0],
				[0, 0]
			],
			[
				[0, 1],
				[1, 0]
			],
			[
				[1, 0],
				[1, 0]
			],
			[
				[1, 1],
				[0, 1]
			]
		]
	},
	'Full-Bit Adder': {
		description:
			'A complete addition circuit. Does binary addition on its three inputs and outputs a SUM and a CARRY. Essentially a stackable half-bit adder.',
		inputList: ['Input 1', 'Input 2', 'Carry-in'],
		outputList: ['Sum', 'Carry-out'],
		nInputs: 3,
		truthTable: [
			[
				[0, 0, 0],
				[0, 0]
			],
			[
				[0, 0, 1],
				[1, 0]
			],
			[
				[0, 1, 0],
				[1, 0]
			],
			[
				[0, 1, 1],
				[0, 1]
			],
			[
				[1, 0, 0],
				[1, 0]
			],
			[
				[1, 0, 1],
				[0, 1]
			],
			[
				[1, 1, 0],
				[0, 1]
			],
			[
				[1, 1, 1],
				[1, 1]
			]
		]
	},
	'2-to-1 Multiplexer': {
		description:
			'A routing node. If Select is off, it outputs whatever Input 1 is. If Select is on, it outputs whatever Input 2 is.',
		inputList: ['Input 1', 'Input 2', 'Select'],
		outputList: ['Output'],
		nInputs: 3,
		truthTable: [
			// [Input 1, Input 2, Select], [Output]
			[[0, 0, 0], [0]],
			[[0, 0, 1], [0]],
			[[0, 1, 0], [0]],
			[[0, 1, 1], [1]],
			[[1, 0, 0], [1]],
			[[1, 0, 1], [0]],
			[[1, 1, 0], [1]],
			[[1, 1, 1], [1]]
		]
	},
	'1-to-2 Demultiplexer': {
		description:
			'A routing node. If Select is off, send Input to A. If Select is on, send Input to B.',
		inputList: ['Input 1', 'Select'],
		outputList: ['A', 'B'],
		nInputs: 2,
		truthTable: [
			[
				[0, 0],
				[0, 0]
			],
			[
				[0, 1],
				[0, 0]
			],
			[
				[1, 0],
				[1, 0]
			],
			[
				[1, 1],
				[0, 1]
			]
		]
	},
	'1-Bit Comparator': {
		description:
			'Outputs one of Equal, Greater or Less depending on whether A is equal to, greater than, or less than B.',
		inputList: ['A', 'B'],
		outputList: ['Equal', 'Greater', 'Lesser'],
		nInputs: 2,
		truthTable: [
			[
				[0, 0],
				[1, 0, 0]
			],
			[
				[0, 1],
				[0, 0, 1]
			],
			[
				[1, 0],
				[0, 1, 0]
			],
			[
				[1, 1],
				[1, 0, 0]
			]
		]
	},
	'Majority Gate': {
		description:
			'A voting node. Outputs a true signal only if the majority (2 or more) of its inputs are on.',
		inputList: ['Input 1', 'Input 2', 'Input 3'],
		outputList: ['Output'],
		nInputs: 3,
		truthTable: [
			[[0, 0, 0], [0]],
			[[0, 0, 1], [0]],
			[[0, 1, 0], [0]],
			[[0, 1, 1], [1]],
			[[1, 0, 0], [0]],
			[[1, 0, 1], [1]],
			[[1, 1, 0], [1]],
			[[1, 1, 1], [1]]
		]
	}
};
