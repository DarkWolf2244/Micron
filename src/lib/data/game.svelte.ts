import { browser } from '$app/environment';
import { createSchematicFromData, type Schematic } from './schematic.svelte';
import GateAND from '$lib/components/ui/nodes/gates/GateAND.svelte';
import GateOR from '$lib/components/ui/nodes/gates/GateOR.svelte';
import GateXOR from '$lib/components/ui/nodes/gates/GateXOR.svelte';
import GenericNode from '$lib/components/ui/nodes/GenericNode.svelte';
import GateNOT from '$lib/components/ui/nodes/gates/GateNOT.svelte';
import TransistorNMOS from '$lib/components/ui/nodes/transistors/TransistorNMOS.svelte';
import TransistorPMOS from '$lib/components/ui/nodes/transistors/TransistorPMOS.svelte';
import InputToggleButton from '$lib/components/ui/nodes/inputs/InputToggleButton.svelte';
import type { Component } from 'svelte';
import type { XYPosition } from '@xyflow/svelte';
import OneBitReadout from '$lib/components/ui/nodes/outputs/SingleReadout.svelte';
import GateNOR from '$lib/components/ui/nodes/gates/GateNOR.svelte';
import GateNAND from '$lib/components/ui/nodes/gates/GateNAND.svelte';
import HalfBitAdder from '$lib/components/ui/nodes/arithmetic/HalfBitAdder.svelte';
import FullBitAdder from '$lib/components/ui/nodes/arithmetic/FullBitAdder.svelte';
import T1Multiplexer from '$lib/components/ui/nodes/routing/2T1Multiplexer.svelte';
import T2Demultiplexer from '$lib/components/ui/nodes/routing/1T2Demultiplexer.svelte';
import OneBitComparator from '$lib/components/ui/nodes/logic/OneBitComparator.svelte';
import MajorityGate from '$lib/components/ui/nodes/logic/MajorityGate.svelte';

export let nodeRegistry: {
	[key: string]: { [key: string]: Component<any> };
} = {
	Gates: {
		AND: GateAND,
		OR: GateOR,
		XOR: GateXOR,
		NOT: GateNOT,
		NOR: GateNOR,
		NAND: GateNAND
	},
	Arithmetic: {
		'Half-Bit Adder': HalfBitAdder,
		'Full-Bit Adder': FullBitAdder
	},
	Routing: {
		'2-to-1 Multiplexer': T1Multiplexer,
		'1-to-2 Demultiplexer': T2Demultiplexer
	},
	Logic: {
		'1-Bit Comparator': OneBitComparator,
		'Majority Gate': MajorityGate
	},
	Inputs: {
		'Toggle Button': InputToggleButton
	},
	Outputs: {
		'Single Readout': OneBitReadout
	}
};

export const nodeTypes = Object.fromEntries(
	Object.entries(nodeRegistry).flatMap(([category, nodes]) =>
		Object.entries(nodes).map(([name, component]) => [`${category}.${name}`, component])
	)
);
export const nodeCategories = Object.keys(nodeRegistry);
export const courseOutline = [
	'Gates.AND',
	'Gates.OR',
	'Gates.XOR',
	'Arithmetic.Half-Bit Adder',
	'Arithmetic.Full-Bit Adder',
	'Logic.Majority Gate',
	'Routing.2-to-1 Multiplexer',
	'Routing.1-to-2 Demultiplexer',
	'Logic.1-Bit Comparator'
];

interface GameData {
	initialized: number;
	schemaVersion: number;
	schematics: Schematic[];
	activeSchematicID: string;
	activatedInputs: { id: string; active: boolean }[];
	unlockedSchematics: string[];
	nextSchematicToUnlock?: string;
}

export let gameDataStore: {
	data: GameData | null;
	loadingGameData: boolean;
} = $state({
	data: null,
	loadingGameData: true
});

export function initializeNewSave() {
	const schematicId = crypto.randomUUID();

	gameDataStore.data = {
		initialized: Date.now(),
		schemaVersion: 1,
		schematics: [createSchematicFromData('Untitled Schematic', [], [], schematicId)],
		activeSchematicID: schematicId,
		activatedInputs: [],
		unlockedSchematics: [
			'Gates.NOT',
			'Gates.NAND',
			'Gates.NOR',
			'Inputs.Toggle Button',
			'Outputs.Single Readout'
		],
		nextSchematicToUnlock: 'Gates.AND'
	};
}

if (browser) {
	const localDataString = localStorage.getItem('micron__gamedata');
	if (localDataString) {
		gameDataStore.data = JSON.parse(localDataString);
	}
	gameDataStore.loadingGameData = false;
}

$effect.root(() => {
	$effect(() => {
		let data = gameDataStore.data;
		if (!data) return;

		let activeSchematic = data.schematics.find((s) => s.id == data.activeSchematicID);
		if (!activeSchematic) {
			console.error('Schematics:', data.schematics);
			console.error(data.activeSchematicID);

			throw 'There is no active schematic.';
		}

		if (!activeSchematic.nodes) {
			activeSchematic.nodes = [];
		}

		if (!activeSchematic.edges) {
			activeSchematic.edges = [];
		}

		activeSchematic.edges = activeSchematic.edges.map((e) => {
			if (activeSchematic.nodes.find((n) => n.id == e.source)?.data.active) {
				return {
					...e,

					style: 'stroke: var(--primary)'
				};
			} else {
				return {
					...e,
					style: 'stroke: var(--xy-edge-stroke-default)'
				};
			}
		});

		localStorage.setItem('micron__gamedata', JSON.stringify(data));
	});
});
