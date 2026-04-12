import { browser } from '$app/environment';
import { Schematic } from './schematic.svelte';

interface GameData {
	initialized: number;
	schemaVersion: number;
	schematics: Schematic[];
	activeSchematicID: string;
}

export let gameDataStore: { data: GameData | null; loadingGameData: boolean } = $state({
	data: null,
	loadingGameData: true
});

export function initializeNewSave() {
	const schematicId = crypto.randomUUID();

	gameDataStore.data = {
		initialized: Date.now(),
		schemaVersion: 1,
		schematics: [new Schematic('Untitled Schematic', schematicId)],
		activeSchematicID: schematicId
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
