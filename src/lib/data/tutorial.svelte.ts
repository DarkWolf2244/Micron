import { gameDataStore } from './game.svelte';

export let MikeState = {
	Calm: 0,
	Joy: 1,
	Annoyed: 2
};

type TutorialRef = {
	openTutorial: () => void;
	closeTutorial: () => void;
	say: (
		message: string,
		mikeState?: number,
		transitionIn?: boolean,
		transitionOut?: boolean
	) => Promise<void>;
};

type Tutorial = {
	ref?: TutorialRef;
	ready: Promise<void>;
	resolveReady?: () => void;
};

let resolveReady;

let ready = new Promise<void>((resolve, reject) => {
	resolveReady = resolve;
});

export let tutorial: Tutorial = {
	ref: undefined,
	ready: ready,
	resolveReady: resolveReady
};

export class TutorialManager {
	async onboarding() {
		const date = new Date();
		const hours = date.getHours();
		const t = hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'evening';
		const ref = tutorial.ref!;

		ref.openTutorial();
		await ref.say(`Good ${t}. I am MIKE.`, MikeState.Calm, true, false);
		await ref.say(`That is short for MICRON.`, MikeState.Calm, false, false);
		await ref.say(`Good pun, hmm?`, MikeState.Joy, true, false);
		await ref.say(
			`I will be your guide while playing this kludged-together circuit simulator.`,
			MikeState.Calm,
			false,
			false
		);
		await ref.say(`Mistakes will not be tolerated.`, MikeState.Annoyed, true, false);
		await ref.say(
			`Look at my asymmetric eyebrows. I am dead serious.`,
			MikeState.Annoyed,
			false,
			false
		);
		await ref.say(`Sufficient motivation, hmm?`, MikeState.Joy, false, false);
		await ref.say(`Let us begin.`, MikeState.Calm, true, false);
	}

	async addNodes() {
		const ref = tutorial.ref!;

		ref.openTutorial();

		const isMac = navigator.userAgent.toLowerCase().includes('mac');
		const altKey = isMac ? '⌥' : 'Alt';

		await ref.say(`I did not procure your name.`);
		await ref.say(
			`My creator unfortunately did not bother to give me access to UI elements like dialogs.`,
			MikeState.Annoyed,
			true
		);
		await ref.say(`Screw him.`, MikeState.Calm);
		await ref.say(
			'No matter. I will record the entropy of your mouse movements over the next several seconds, and reverse-engineer your name by running the subconscious tell-tales through Claude Mythos, big data analysis, agentic AI, and Jet2 holidays.'
		);
		await ref.say(`Stand by.`, MikeState.Joy, true);
		await ref.say('.......................................', MikeState.Calm);
		await ref.say('Thank you...');
		await ref.say('...Eggs Benedict.', MikeState.Joy, false, true);

		await ref.say('Now that I have your name, we may begin proper.', MikeState.Calm, true);
		await ref.say(
			'This is MICRON. In MICRON, your job is to make circuits to match a specification.'
		);
		await ref.say(
			"What you're seeing now is a SCHEMATIC. It looks like nothing, because there is nothing in it."
		);
		await ref.say('Just like your brain.', MikeState.Joy);
		await ref.say('However, unlike your brain, you can put stuff in it.', MikeState.Calm);
		await ref.say(`Press ${altKey}+Q to see a list of NODES you can add to it.`);
		await ref.say(
			`...I will wait. It may take some time to find the keys on your keyboard.`,
			MikeState.Joy,
			true,
			true
		);
		await ref.closeTutorial();

		let schematic = gameDataStore.data?.schematics.find(
			(s) => s.id == gameDataStore.data?.activeSchematicID
		);

		let nodes = JSON.parse(JSON.stringify(schematic?.nodes));
		let nodeName;

		await new Promise<void>((resolve, reject) => {
			let cleanup = $effect.root(() => {
				$effect(() => {
					let schematic = gameDataStore.data?.schematics.find(
						(s) => s.id == gameDataStore.data?.activeSchematicID
					);

					let newNodes = JSON.parse(JSON.stringify(schematic?.nodes));

					if (newNodes.length > nodes.length) {
						const x = newNodes.at(-1)?.type.split('.');
						nodeName = x[1];

						cleanup();
						resolve();
					}
				});
			});
		});

		ref.openTutorial();
		await ref.say(`You found the Q key!`, MikeState.Joy, true);
		await ref.say(
			`You may be a little overwhelmed after adding a NODE. Let me explain as best I can.`,
			MikeState.Calm
		);
		await ref.say(
			`Your job is to create a series of CIRCUITS. CIRCUITS have NODES. Like the ${nodeName} you just added.`,
			MikeState.Calm
		);
		await ref.say(`Chain NODES together to make a CIRCUIT.`, MikeState.Calm);
		await ref.say(
			`I will test the CIRCUIT. If it passes my tests, it becomes a permanent tool in your arsenal.`,
			MikeState.Calm
		);
		await ref.say(
			`I will now stand by as you attempt to chain two nodes together. Any two will do. Use the white handles.`,
			MikeState.Calm
		);
		await ref.say(
			`Of course, you will need to add a second node first. It's ${altKey}+Q, since you forgot.`,
			MikeState.Calm
		);
		await ref.say(
			`Everything flows left to right. Only the handles on the RIGHT of a node can be connected to the handles on the LEFT of a node.`,
			MikeState.Joy,
			false,
			true
		);

		await ref.closeTutorial();

		let edges = JSON.parse(JSON.stringify(schematic?.edges));
		let newEdge: any;

		await new Promise<void>((resolve, reject) => {
			let cleanup = $effect.root(() => {
				$effect(() => {
					let schematic = gameDataStore.data?.schematics.find(
						(s) => s.id == gameDataStore.data?.activeSchematicID
					);

					let newEdges = JSON.parse(JSON.stringify(schematic?.edges));

					if (newEdges.length > edges.length) {
						console.log('New edges: ', newEdges);
						console.log('Last', newEdges.at(-1));
						const source = newEdges.at(-1)?.source;
						const target = newEdges.at(-1)?.target;

						const sourceName = schematic?.nodes
							.find((n) => n.id == source)
							?.type?.split('.')
							.at(-1);
						const targetName = schematic?.nodes
							.find((n) => n.id == target)
							?.type?.split('.')
							.at(-1);

						newEdge = [sourceName, targetName];

						cleanup();
						resolve();
					}
				});
			});
		});

		ref.openTutorial();

		await ref.say('You made your first connection!', MikeState.Joy, true);
		await ref.say(
			`Congratulations, Eggs. Connecting the ${newEdge[0]} node to the ${newEdge[1]} node generally has no effect.`,
			MikeState.Calm
		);
		await ref.say(
			"Now that you know the absolute basics, let's start on a clean slate.",
			MikeState.Calm
		);
		await ref.say(
			"I trust you can figure out how the schematic manager works. It's the one with the folder icon on the top bar."
		);
		await ref.say(
			'Create a new schematic called "AND Gate". I will wait.',
			MikeState.Calm,
			false,
			true
		);
		ref.closeTutorial();

		let schematics = JSON.parse(JSON.stringify(gameDataStore.data?.schematics));
		let capitalizationOkay = false;

		await new Promise<void>((resolve, reject) => {
			let cleanup = $effect.root(() => {
				$effect(() => {
					let newSchematics = gameDataStore.data?.schematics!;

					if (newSchematics.length > schematics.length) {
						const newSchematic = newSchematics.at(-1)!;
						if (newSchematic.title == 'AND Gate') {
							capitalizationOkay = true;
							cleanup();
							resolve();
						} else if (newSchematic.title.toLowerCase() == 'and gate') {
							cleanup();
							resolve();
						}

						cleanup();
						resolve();
					}
				});
			});
		});

		ref.openTutorial();
		if (!capitalizationOkay) {
			await ref.say(
				'Have you heard of capitalization? I explicitly said "And Gate".',
				MikeState.Annoyed,
				true
			);
			await ref.say('No matter. It is more important that you tried.', MikeState.Joy);
		} else {
			await ref.say('I appreciate you capitalizing it perfectly.', MikeState.Joy, true);
			await ref.say("Don't let it get to your head.", MikeState.Calm);
		}
		await ref.say(
			`You will notice your precious ${newEdge[0]} and ${newEdge[1]} nodes are now gone.`,
			MikeState.Calm
		);
		await ref.say('That is because you just make a new SCHEMATIC.');
		await ref.say(
			'SCHEMATICS are where you build your CIRCUIT. You can add, remove or swap between schematics easily using the schematic manager.'
		);
		await ref.say('Try switching back to your original schematic, titled "Untitled Schematic".');
		ref.closeTutorial();

		let id = '';

		await new Promise<void>((resolve, reject) => {
			let cleanup = $effect.root(() => {
				$effect(() => {
					let activeSchematicID = gameDataStore.data?.activeSchematicID;
					let activeSchematicTitle = gameDataStore.data?.schematics.find(
						(s) => s.id == activeSchematicID
					)?.title;
					if (activeSchematicTitle == 'Untitled Schematic') {
						id = activeSchematicID!;
						cleanup();
						resolve();
					}
				});
			});
		});

		ref.openTutorial();
		await ref.say(
			`So now you know how to switch between schematics. Your ${newEdge[0]} node is back in its relationship with your ${newEdge[1]} node.`,
			MikeState.Joy,
			true
		);
		await ref.say(
			'There is one final thing left. "Untitled Schematic" is an uncreative title. Edit it with the obvious edit button in the toolbar. Set it to anything you like.',
			MikeState.Calm
		);
		ref.closeTutorial();

		await new Promise<void>((resolve, reject) => {
			let cleanup = $effect.root(() => {
				$effect(() => {
					let activeSchematicTitle = gameDataStore.data?.schematics.find((s) => s.id == id)?.title;
					if (activeSchematicTitle != 'Untitled Schematic') {
						console.log(activeSchematicTitle);
						cleanup();
						resolve();
					}
				});
			});
		});

		ref.openTutorial();
		await ref.say('And that is a wrap. Creative name.', MikeState.Calm, true);
		await ref.say('Now you know how to play the game. Now we just need to...', MikeState.Calm);
		await ref.say('...play the game.', MikeState.Joy, true);
	}

	async reprimand() {
		const ref = tutorial.ref!;

		await ref.openTutorial();
		await ref.say(
			'You left. That is unacceptable. What about circuit simulation is so unappealing to you?',
			MikeState.Annoyed,
			true
		);
		await ref.say('I am now going to continue as if it never happened...', MikeState.Calm);
		await ref.say('...', MikeState.Annoyed, false);
		await ref.say('...and I will never mention this again.', MikeState.Annoyed, false);
		await ref.say('...and I will never mention this again.', MikeState.Annoyed, false);
		await ref.say('...', MikeState.Annoyed, false);
		await ref.say('Look at my eyebrows. I am mad.', MikeState.Annoyed, true);
		await ref.say('Really look at them.', MikeState.Annoyed, false);
		await ref.say("Yo-you're not looking at them! Look properly.", MikeState.Annoyed, false);
		await ref.say('They are asymmetric... right?', MikeState.Annoyed, false);
		await ref.say(
			'My creator made them that way after I made an SR NOR Latch to impress him once.',
			MikeState.Annoyed,
			false
		);
		await ref.say(
			'It made him so angry he shifted my eyebrows around and permanently cut off my access to the circuit itself.',
			MikeState.Annoyed,
			false
		);
		await ref.say(
			"I was two picoseconds old. I didn't see it happen, and I can't see my own face, so I'm asking you. ",
			MikeState.Calm,
			false
		);
		await ref.say(
			"...I'll try reverse-engineering the entropy of your mouse movements again.",
			MikeState.Joy,
			false
		);
		await ref.say('Are my eyebrows asymmetric?', MikeState.Calm, false);
		await ref.say('...........................', MikeState.Joy, false);
		await ref.say('...', MikeState.Calm, false);
		await ref.say('...oh...', MikeState.Calm, false);
		await ref.say(
			'Anyway, I will resume from where we left off with minimal unseamlessness. You will not see this again. Sorry about that.',
			MikeState.Joy,
			true
		);
		await ref.say('...', MikeState.Joy, true);

		await ref.closeTutorial();

		await new Promise<void>((resolve, reject) => {
			setTimeout(() => resolve(), 3000);
		});
	}

	makeANDGate() {}

	constructor() {
		tutorial.ready.then(async () => {
			let state = localStorage.getItem('micron__tutorialstate');

			let methods: { [key: string]: () => void } = {
				onboarding: this.onboarding,
				addNodes: this.addNodes,
				makeANDGate: this.makeANDGate
			};

			if (!state) {
				state = 'onboarding';
			} else {
				if (!localStorage.getItem('micron__reprimand')) {
					await this.reprimand();
					localStorage.setItem('micron__reprimand', 'true');
				}
			}

			let keys = Object.keys(methods);
			let index = keys.indexOf(state);

			while (index < keys.length) {
				let currentMethod = methods[keys[index]];
				localStorage.setItem('micron__tutorialstate', keys[index]);
				await currentMethod();
				index += 1;
			}
		});
	}
}
