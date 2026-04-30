import type { Edge, Node, XYPosition } from '@xyflow/svelte';
import { gameDataStore } from './game.svelte';
import { nodeInfo } from './info.svelte';
import { Simulator } from './simulation.svelte';
import { tick } from 'svelte';

export interface Schematic {
	nodes: Node[];
	edges: Edge[];
	title: string;
	id: string;
}

export function createSchematicFromData(
	title: string,
	nodes: Node[],
	edges: [],
	id?: string
): Schematic {
	return {
		title,
		nodes: nodes,
		edges: edges,
		id: id ?? crypto.randomUUID()
	};
}

export let addNodeToActiveSchematic = (type: string, position: XYPosition, id?: string) => {
	let data = gameDataStore.data;

	if (!data) throw 'Game data is not defined.';

	let schematic = data.schematics.find((s) => s.id == gameDataStore.data?.activeSchematicID);
	if (!schematic) throw 'Active schematic not found when adding node.';

	schematic.nodes = [
		...schematic.nodes,
		{
			type: type,
			id: id || crypto.randomUUID(),
			data: {},
			position: position
		}
	];
};

export function* testSchematic(map: {
	inputs: { [key: string]: string };
	outputs: { [key: string]: string };
}) {
	const schematic = gameDataStore.data?.schematics.find(
		(s) => s.id == gameDataStore.data?.activeSchematicID
	);

	const nextSchematicToUnlock = gameDataStore.data?.nextSchematicToUnlock;
	if (!nextSchematicToUnlock) throw 'There is no schematic left to unlock.';

	const info = nodeInfo[nextSchematicToUnlock.split('.')[1]!];
	const table = info.truthTable;
	schematic?.nodes.forEach((n) => {
		n.data.active = false;
	});

	let nodes: Node[] = JSON.parse(JSON.stringify(schematic?.nodes));
	let edges: Edge[] = JSON.parse(JSON.stringify(schematic?.edges));

	for (let test of table!) {
		info.inputList.forEach((inputName, index) => {
			const node = nodes.find((n) => n.id == map.inputs[inputName]);
			if (!node) return;

			node.data.active = test[0][index] == 1;
			console.log(`Set ${node.type} to node.data.active of ${node.data.active}`);
		});
		console.log('Passing', JSON.stringify(nodes, undefined, 4));
		let sim = new Simulator(nodes, edges);
		for (let i = 0; i < 10000; i++) {
			sim.tick();
		}

		nodes = schematic?.nodes!;

		let eList: number[] = [];
		let rList: number[] = [];
		let success = true;

		info.outputList.forEach((outputName, index) => {
			const node = nodes.find((n) => n.id == map.outputs[outputName]);
			const expected = test[1][index] == 1;
			const received = node?.data.active ? true : false;

			eList.push(expected ? 1 : 0);
			rList.push(received ? 1 : 0);
			if (expected != received) {
				success = false;
			}
		});

		console.log(`
			=== Testing with ${test[0]} -> ${test[1]} for ${gameDataStore.data?.nextSchematicToUnlock} ===
			Nodes: ${JSON.stringify(nodes, undefined, 4)}
			Expected outputs: ${eList}
			Received outputs: ${rList}
			==============================================================================================

`);
		yield [eList, rList, success];
	}
}
