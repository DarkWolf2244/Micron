import { browser } from '$app/environment';

interface GameData {
	initialized: number;
	schemaVersion: number;
}

export let gameDataStore: { data: GameData | null; loadingGameData: boolean } = $state({
	data: null,
	loadingGameData: true
});

export function initializeNewSave() {
	gameDataStore.data = {
		initialized: Date.now(),
		schemaVersion: 1
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
        if (!gameDataStore.data) return;
		localStorage.setItem('micron__gamedata', JSON.stringify(gameDataStore.data));
	});
});
