import type { Edge, Node, XYPosition } from '@xyflow/svelte';
import { gameDataStore } from './game.svelte';

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
