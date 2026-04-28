export const MikeState = {
	Awake: 0,
	Happy: 1,
	Annoyed: 2
} as const;

export type MikeStateValue = (typeof MikeState)[keyof typeof MikeState];

export interface LaunchOptions {
	transitionIn?: boolean;
	transitionOut?: boolean;
}

export type LaunchFn = (
	text: string,
	mikeState: MikeStateValue,
	options?: LaunchOptions
) => Promise<void>;

export let tutorialStore: {
	launch?: LaunchFn;
} = $state({
	launch: undefined
});

/**
 * Waits until `tutorialStore.launch` is assigned by the TutorialOverlay
 * component, then returns it. Polls every 50ms — no arbitrary 2-second delay.
 */
function waitForLaunch(): Promise<LaunchFn> {
	return new Promise((resolve) => {
		const check = () => {
			if (tutorialStore.launch) {
				resolve(tutorialStore.launch);
			} else {
				setTimeout(check, 50);
			}
		};
		check();
	});
}

export class TutorialManager {
	constructor() {
		this.run();
	}

	private async run() {
		const launch = await waitForLaunch();

		const date = new Date();
		const hours = date.getHours();
		const t = hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'evening';

		// First message: Panel flies in, Mike animates in
		await launch(`Good ${t}. I am MIKE.`, MikeState.Awake, {
			transitionIn: true,
			transitionOut: true
		});
		
		// Continue without re-animating (panel stays up, Mike stays at end state)
		await launch('That is short for MICRON.', MikeState.Awake, {
			transitionIn: true,
			transitionOut: true
		});
		
		// Change to Happy state with animation
		await launch('Good pun, yes?', MikeState.Happy, {
			transitionIn: true,
			transitionOut: false
		});
		
		// Continue in Happy state without re-animating
		await launch(
			'I will be your guide while playing this kludged-together circuit simulator.',
			MikeState.Happy,
			{ transitionIn: false, transitionOut: false }
		);
		
		// Change to Annoyed state with animation, then reverse out at end
		await launch('Mistakes will not be tolerated.', MikeState.Annoyed, {
			transitionIn: true,
			transitionOut: true
		});
	}
}