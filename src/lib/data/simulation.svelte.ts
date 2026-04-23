// Given `nodes` and `edges`, we figure out which nodes are to be activated for each tick. That is the input.
// First we need to build a directed graph starting with the root nodes of inputs. Only inputs can be root nodes, and root node
// can only ever be inputs.
// The simulator outputs `nodes`, but with an extra data object that sets `active` to true or false. This replaces the schematic's nodes.

import { type Node, type Edge } from '@xyflow/svelte';
import { gameDataStore } from './game.svelte';

const executors: {
	[key: string]: (inputs: boolean[], nodeData: any) => { active: boolean; outputs: boolean[] };
} = {
	'Inputs.Toggle Button': (_inputs, nodeData) => {
		return {
			active: nodeData.active,
			outputs: [nodeData.active]
		};
	},
	'Gates.AND': (inputs, _nodeData) => {
		const result = inputs[0] && inputs[1];
		return {
			active: result,
			outputs: [result]
		};
	},
	'Gates.OR': (inputs, _nodeData) => {
		const result = inputs[0] || inputs[1];
		return {
			active: result,
			outputs: [result]
		};
	},
	'Gates.XOR': (inputs, _nodeData) => {
		const result = inputs[0] !== inputs[1];
		return {
			active: result,
			outputs: [result]
		};
	},
	'Gates.NOT': (inputs, _nodeData) => {
		const result = !inputs[0];
		return {
			active: result,
			outputs: [result]
		};
	},
	'Outputs.OneBitReadout': (inputs, _nodeData) => {
		return {
			active: inputs[0] ?? false,
			outputs: []
		};
	}
};

const metadataRegistry: {
	executors: {
		[key: string]: (inputs: boolean[], nodeData: any) => { active: boolean; outputs: boolean[] };
	};
	n_inputs: { [key: string]: number };
} = {
	executors: executors,
	n_inputs: {
		'Inputs.Toggle Button': 0,
		'Gates.AND': 2,
		'Gates.XOR': 2,
		'Gates.OR': 2,
		'Gates.NOT': 1,
		'Outputs.OneBitReadout': 1
	}
};

interface SimNode {
	id: string;
	type: string;
	executor: (inputs: boolean[], nodeData: any) => { active: boolean; outputs: boolean[] };
	inputCache: boolean[];
	outputCache: boolean[];
	outputConnections: { targetNodeID: string; targetNodeInputIndex: number }[][];
}

function getStoreNodes(): Node[] {
	const data = gameDataStore.data;
	if (!data) throw 'Game data is not initialized.';
	const schematic = data.schematics.find((s) => s.id === data.activeSchematicID);
	if (!schematic) throw 'Active schematic not found.';
	return schematic.nodes;
}

function getStoreNodeById(id: string): Node {
	const node = getStoreNodes().find((n) => n.id === id);
	if (!node) throw `Node ${id} not found in store.`;
	return node;
}

export class Simulator {
	simnodes: SimNode[] = [];
	dirty: SimNode[];

	constructor(nodes: Node[], edges: Edge[]) {
		this.simnodes = nodes.map((node) => {
			const type = node.type;

			if (!type) {
				throw `Node ID ${node.id} has no type.`;
			}

			let connections: { targetNodeID: string; targetNodeInputIndex: number }[][] = [];

			for (let edge of edges) {
				if (edge.source === node.id) {
					const sourceHandle = edge.sourceHandle!;
					const targetHandle = edge.targetHandle!;

					const outIndex = parseInt(sourceHandle.split('#')[1]);
					const inIndex = parseInt(targetHandle.split('#')[1]);

					let connectionObject = {
						targetNodeID: edge.target,
						targetNodeInputIndex: inIndex
					};

					while (connections.length <= outIndex) {
						connections.push([]);
					}

					connections[outIndex].push(connectionObject);
				}
			}

			const n_inputs = metadataRegistry.n_inputs[type];

			if (n_inputs === undefined) {
				throw `N_input not defined for ${type}`;
			}

			const executor = metadataRegistry.executors[type];
			if (!executor) {
				throw `Executor not defined for ${type}`;
			}

			return {
				id: node.id,
				type: type,
				executor: executor,
				inputCache: Array.from({ length: n_inputs }, () => false),
				outputCache: [],
				outputConnections: connections
			};
		});

		// Initially mark all input nodes as dirty so they get evaluated on first tick
		this.dirty = this.simnodes.filter((simnode) => simnode.type.split('.')[0] === 'Inputs');
	}

	private getSimNodeByID(id: string): SimNode {
		const node = this.simnodes.find((n) => n.id === id);
		if (!node) throw `SimNode ${id} not found.`;
		return node;
	}

	tick() {
		for (const simnode of this.simnodes) {
			if (simnode.type.split('.')[0] !== 'Inputs') continue;

			const storeNode = getStoreNodeById(simnode.id);
			const storeActive = storeNode.data.active ?? false;

			if (storeActive !== (simnode.outputCache[0] ?? false)) {
				if (!this.dirty.some((d) => d.id === simnode.id)) {
					this.dirty.push(simnode);
				}
			}
		}

		if (!this.dirty || this.dirty.length === 0) return;

		const changedNodeIds = new Set<string>();
		const newDirty = new Map<string, SimNode>();

		for (const simnode of this.dirty) {
			const storeNode = getStoreNodeById(simnode.id);
			const currentData = storeNode.data;

			const { active, outputs } = simnode.executor(simnode.inputCache, currentData);

			const outputsChanged =
				outputs.length !== simnode.outputCache.length ||
				outputs.some((val, index) => val !== simnode.outputCache[index]);

			const activeChanged = active !== (currentData.active ?? false);

			if (activeChanged) {
				changedNodeIds.add(simnode.id);
			}

			if (outputsChanged) {
				simnode.outputCache = outputs;
			}

			if (outputsChanged) {
				for (let i = 0; i < simnode.outputConnections.length; i++) {
					const connections = simnode.outputConnections[i];
					for (const conn of connections) {
						const targetNode = this.getSimNodeByID(conn.targetNodeID);
						targetNode.inputCache[conn.targetNodeInputIndex] = outputs[i] ?? false;
						newDirty.set(targetNode.id, targetNode);
					}
				}
			}
		}

		if (changedNodeIds.size > 0) {
			const storeNodes = getStoreNodes();

			for (const nodeId of changedNodeIds) {
				const simnode = this.getSimNodeByID(nodeId);
				const storeNode = storeNodes.find((n) => n.id === nodeId);
				if (!storeNode) continue;

				const { active } = simnode.executor(simnode.inputCache, storeNode.data);

				storeNode.data.active = active;
			}
		}
		this.dirty = Array.from(newDirty.values());
	}
}
