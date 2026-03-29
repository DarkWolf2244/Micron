import type { Edge, Node, XYPosition } from '@xyflow/svelte';

class FlowManager {
	nodes: Node[];
	edges: Edge[];

	constructor() {
		this.nodes = $state.raw([]);
		this.edges = $state.raw([]);
	}

	addNode(id: string, mousePosition: XYPosition) {
		let uuid = crypto.randomUUID();
		this.nodes = [
			...this.nodes,
			{
				id: uuid,
				data: {},
				position: mousePosition,
				type: id
			}
		];
	}
}

export let flowManagerInstance = new FlowManager();
