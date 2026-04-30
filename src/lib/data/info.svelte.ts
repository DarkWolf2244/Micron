export let nodeInfo: {
	[key: string]: {
		description: string;
		nInputs: number;
		truthTable: number[][][];
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
	}
};
