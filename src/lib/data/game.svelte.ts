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
import OneBitReadout from '$lib/components/ui/nodes/outputs/OneBitReadout.svelte';

export let nodeRegistry: {
	[key: string]: { [key: string]: Component<any> };
} = {
	Gates: {
		AND: GateAND,
		OR: GateOR,
		XOR: GateXOR,
		NOT: GateNOT
	},
	Transistors: {
		NMOS: TransistorNMOS,
		PMOS: TransistorPMOS
	},
	Inputs: {
		'Toggle Button': InputToggleButton
	},
	Outputs: {
		'OneBitReadout': OneBitReadout
	}
};

export const nodeTypes = Object.fromEntries(
	Object.entries(nodeRegistry).flatMap(([category, nodes]) =>
		Object.entries(nodes).map(([name, component]) => [`${category}.${name}`, component])
	)
);
export const nodeCategories = Object.keys(nodeRegistry);

interface GameData {
	initialized: number;
	schemaVersion: number;
	schematics: Schematic[];
	activeSchematicID: string;
	activatedInputs: {id: string, active: boolean}[]
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
		activatedInputs: []
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

		localStorage.setItem('micron__gamedata', JSON.stringify(data));
	});
});
