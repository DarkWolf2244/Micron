export let overlayStore: OverlayStore = $state({
	active: false,
	runOnce: (message: string, subtitle: string, primaryButtonLabel: string, then: any) => {
		console.error('Overlay component has not been initialized yet.');
	},
	close: () => {
		console.error('Overlay component has not been initialized yet.');
	}
});

export interface OverlayStore {
	active: boolean;
	runOnce: (message: string, subtitle: string, primaryButtonLabel: string, then: any) => void;
	close: () => void;
}
