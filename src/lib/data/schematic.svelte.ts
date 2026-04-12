import type { Edge, Node } from '@xyflow/svelte';

export class Schematic {
	nodes: Node[];
	edges: Edge[];
	title: string;
	id: string;

	constructor(title: string, id?: string) {
		this.nodes = $state([]);
		this.edges = $state([]);
		this.title = title;
		this.id = id || crypto.randomUUID();
	}
}
