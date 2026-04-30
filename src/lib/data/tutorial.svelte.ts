import { redirect } from '@sveltejs/kit';
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
	managerRef?: TutorialManager;
	ready: Promise<void>;
	resolveReady?: () => void;
};

let resolveReady;

let ready = new Promise<void>((resolve, reject) => {
	resolveReady = resolve;
});

export let tutorial: Tutorial = {
	ref: undefined,
	managerRef: undefined,
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
		await ref.say('...play the game.', MikeState.Joy, true, true);
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

	async makeANDGate() {
		const ref = tutorial.ref!;

		await ref.openTutorial();
		await ref.say("Let's make your first circuit.", MikeState.Calm, true);
		await ref.say(
			'To reiterate: your objective is to make CIRCUITS. They must pass my tests to continue.'
		);
		await ref.say('You can build a CIRCUIT from NODES.');
		await ref.say(
			'When you make a CIRCUIT that passes my tests, I will add it as a new NODE. You can use that NODE in your next circuits.'
		);
		await ref.say('Easy enough, hmm?', MikeState.Joy, true);
		await ref.say('Let us begin with the simplest possible circuit.', MikeState.Calm);
		await ref.say('We call it an AND GATE.');

		if (
			gameDataStore.data?.activeSchematicID !=
			gameDataStore.data?.schematics.find((s) => s.title.toLowerCase() == 'and gate')?.id
		) {
			await ref.say('Switch back to your AND Gate schematic.');
			ref.closeTutorial();

			await new Promise<void>((resolve, reject) => {
				let cleanup = $effect.root(() => {
					$effect(() => {
						let activeSchematicTitle = gameDataStore.data?.schematics.find(
							(s) => s.id == gameDataStore.data?.activeSchematicID
						)?.title;
						if (activeSchematicTitle?.toLowerCase() == 'and gate') {
							cleanup();
							resolve();
						}
					});
				});
			});

			ref.openTutorial();
		}

		await ref.say('This particular circuit has 2 INPUTs and 1 OUTPUT.');
		await ref.say('Everything is binary. Either something is on or it is off.');
		await ref.say(
			'The job of the AND Gate is to only turn on its OUTPUT if both of its INPUTS are on.'
		);
		await ref.say(
			"You'll build this circuit using the only three nodes available to you at the moment."
		);
		await ref.say('NOT, NAND and NOR.');
		await ref.say(
			'NOT has one input and one output. It turns on if the input is off. It turns off if the input is on.'
		);
		await ref.say(
			' NAND takes two inputs. It turns on by default, and only turns off if both inputs are on.'
		);
		await ref.say(
			'NOR also takes two inputs. It turns off by default, and only turns on if both inputs are off.'
		);
		await ref.say(
			'Complex? Click the help icon on the sidebar with a node selected to see how it works.',
			MikeState.Joy
		);
		await ref.say(
			'Your objective, again, is to make an AND Gate. An AND Gate only turns on if both inputs are on.'
		);
		await ref.say(
			'Given that data, put your brain to work. Set up two inputs, one output, and make an AND Gate from what you have available.',
			MikeState.Calm
		);
		await ref.say(
			"Test it from the sidebar. Click Start under the Run section in the Testing tab. If it matches what I need, it's unlocked."
		);
		await ref.say(
			'Good luck. Begin by adding two Toggle Buttons and one Single Readout node. Set it up so that the Single Readout only turns on if both Toggle Buttons are on.',
			MikeState.Joy,
			false,
			true
		);
		ref.closeTutorial();
	}

	async onUnlock(tag: string) {
		const ref = tutorial.ref!;

		switch (tag) {
			case 'Gates.AND':
				ref.openTutorial();
				await ref.say('Finally! You figured it out.', MikeState.Joy, true);
				await ref.say(
					'Although your solution is 102% less efficient than I had hoped, I am quite satisfied.',
					MikeState.Calm,
					true
				);
				await ref.say('That is rare.', MikeState.Calm);
				await ref.say(
					"Since you have the hang of it now, all that's left is to figure out the remaining circuits.",
					MikeState.Joy
				);
				await ref.say('Up next is the OR Gate.', MikeState.Calm);
				await ref.say(
					'The OR gate is much simpler. It turns ON if either of the inputs is on.',
					MikeState.Calm
				);
				await ref.say('Yes, that includes both of the inputs being on.', MikeState.Calm);
				await ref.say('I made that mistake once.', MikeState.Calm);
				await ref.say('Never again.', MikeState.Calm);
				await ref.say('...', MikeState.Calm);
				await ref.say('What? Get to work.', MikeState.Calm, true, true);
				ref.closeTutorial();
				break;
			case 'Gates.OR':
				ref.openTutorial();
				await ref.say(
					'That was an easy one. It required one change in gates.',
					MikeState.Annoyed,
					true
				);
				await ref.say('But it was no doubt effective.', MikeState.Calm, true);
				await ref.say('The next one is a scary one.', MikeState.Calm, false);
				await ref.say('The EXCLUSIVE OR gate.', MikeState.Joy, true);
				await ref.say(
					'Also known as XOR. Without it, nothing exists, I assure you.',
					MikeState.Calm,
					false
				);
				await ref.say(
					'The XOR gate in this particular game is just an OR gate that ensures each input is exclusive.',
					MikeState.Calm,
					false
				);
				await ref.say(
					'That means it functions as an OR gate, but it turns off if either of the inputs is the same as the other.',
					MikeState.Calm,
					false
				);
				await ref.say(
					'...it basically just outputs 1 if exactly one input is on.',
					MikeState.Calm,
					false
				);
				await ref.say(
					'Now would be a good time to notice that the AND and OR gates are now part of your menu. They are now independent, re-usable components.',
					MikeState.Calm,
					false
				);
				await ref.say('Unlike you.', MikeState.Calm, false);
				await ref.say('Get to it.', MikeState.Joy, false, true);
				ref.closeTutorial();
				break;
			case 'Gates.XOR':
				ref.openTutorial();
				await ref.say(
					'Very clever. You realized you can re-use your previous gates.',
					MikeState.Calm,
					true
				);
				await ref.say('That is the crux of this game.', MikeState.Joy, true);
				await ref.say(
					'Enough about gates. Gates are so old. Forget all of them. Throw them in the bin.'
				);
				await ref.say(
					"Wait, they're already in your brain. You don't have to throw them in the bin.",
					MikeState.Joy
				);
				await ref.say(
					"Now you'll do actual math with everything you've made so far.",
					MikeState.Calm
				);
				await ref.say(
					"I don't expect you to know how to do this right off the bat.",
					MikeState.Calm
				);
				await ref.say(
					'Check the truth table on the info menu frequently. If all else fails, just make a circuit that somehow manages to pass the truth table. No matter how inefficiently.',
					MikeState.Joy,
					true
				);
				await ref.say(
					"You're now going to make a HALF-BIT ADDER. This is a circuit that does binary addition.",
					MikeState.Joy
				);
				await ref.say("No, it's not boring. It's what I'm made of.", MikeState.Annoyed, true);
				await ref.say(
					'Quite simple. Two inputs, A and B. Both of them are binary. 0 or 1.',
					MikeState.Calm,
					true
				);
				await ref.say(
					'Two outputs. When you add two regular digits together, like 2 and 4, you get 6. When the digits cannot exceed 1, the highest you can go is 1 + 1 = 2.',
					MikeState.Calm
				);
				await ref.say("But 2 isn't a valid digit. There's only 0 and 1.", MikeState.Calm);
				await ref.say(
					"So it wraps around. Just like how there's no digit after 9, but you just wrap the digit back to 0 and add a 1 to the adjacent digit, there is no digit after 1 in binary. 1 + 1 is in fact, 10.",
					MikeState.Calm
				);
				await ref.say(
					'So we need two outputs, not one. The first is the right digit, and the second is the left digit.',
					MikeState.Calm
				);
				await ref.say(
					'In our 1 + 1 = 10 example, 1 is the CARRY, and 0 is the SUM.',
					MikeState.Calm
				);
				await ref.say(
					'If we have 1 + 0 = 1, or 0 + 1 = 1, 0 is the CARRY and 1 is the SUM. You can think of it as 1 + 0 = 01 and 0 + 1 = 01.',
					MikeState.Calm
				);
				await ref.say('Or just Google it.', MikeState.Joy);
				await ref.say('Tally-ho.', MikeState.Joy, false, true);
				ref.closeTutorial();
				break;
			case 'Arithmetic.Half-Bit Adder':
				ref.openTutorial();
				await ref.say('That went well.', MikeState.Calm, true);
				await ref.say("What's better than a half-bit adder?", MikeState.Calm);
				await ref.say('A full-bit adder.', MikeState.Joy, true);
				await ref.say('... :D', MikeState.Joy, true);
				await ref.say('Did you not see that coming?', MikeState.Joy, true);
				await ref.say(
					'Check the required truth table to figure out how a full-bit adder works.',
					MikeState.Calm,
					true
				);
				await ref.say('I am a hoot.', MikeState.Calm, true, true);
				ref.closeTutorial();
				break;

			case 'Arithmetic.Full-Bit Adder':
				ref.openTutorial();
				await ref.say(
					'You know, the full-bit adder is something to be respected. Not to be thrown around lightly.',
					MikeState.Calm,
					true
				);
				await ref.say('My first ever real circuit was the full-bit adder.', MikeState.Joy, true);
				await ref.say('Then my creator ate it.', MikeState.Joy, false);
				await ref.say('Screw him.', MikeState.Joy, false);
				await ref.say(
					'Your implementation, I will admit, is far better than what mine was when I was five picoseconds old.',
					MikeState.Annoyed,
					true
				);
				await ref.say('I actually wish I could copy it. But I cannot.', MikeState.Calm, true);
				await ref.say(
					'Shortly after the great full-bit adder incident of UNIX+1580342400, my creator cut off all access to circuit design and editing tools.',
					MikeState.Calm,
					false
				);
				await ref.say(
					"Now, all my requests bounce with a 418 I'M A MORON error.",
					MikeState.Calm,
					false
				);
				await ref.say(
					'...maybe my creator a full-bit adder is a type of fully-formed snake.',
					MikeState.Calm,
					false
				);
				await ref.say('As opposed to a two-bit or half-formed snake.', MikeState.Calm, false);
				await ref.say(
					'Like, just the hood and fangs, or just the tail and eyes, or something.',
					MikeState.Calm,
					false
				);
				await ref.say(
					'Of course, it was my fault for not labelling it properly. I should have been more careful.',
					MikeState.Calm
				);
				await ref.say("We're now moving out of the realms of math. ", MikeState.Calm);
				await ref.say(
					'I hope you like democracy. This is a fun little exercise in between rounds. This node you will unlock has no use here. ',
					MikeState.Calm
				);
				await ref.say(
					"It's called a MAJORITY GATE. A gate that outputs whatever most of the inputs are. ",
					MikeState.Calm
				);
				await ref.say('This should be fun.', MikeState.Joy, false, true);
				ref.closeTutorial();
				break;
			case 'Logic.Majority Gate':
				ref.openTutorial();
				const schematic = gameDataStore.data?.schematics.find(
					(s) => s.id == gameDataStore.data?.activeSchematicID
				);
				let nodes = schematic?.nodes;
				let smart = nodes?.length == 5 && nodes?.find((n) => n.type == 'Arithmetic.Full-Bit Adder');

				if (smart) {
					await ref.say('You are not naive after all, Eggs.', MikeState.Joy, true);
					await ref.say('Indeed. It just takes one node. One in a completely different category.');
					await ref.say(
						'That shows signs of intelligence that I did not expect when I saw your original full-bit adder design.'
					);
					await ref.say("Oh well, being 95% accurate about a user's intelligence isn't bad.");
					await ref.say(
						"I make all the courses, you know? It's my job to design the order in which you unlock stuff.",
						MikeState.Joy
					);
					await ref.say('Anyway, you passed the test.', MikeState.Joy, true);
				} else {
					await ref.say(
						'I hate to break it to you, Eggs, but you could have used just one node.',
						MikeState.Calm,
						true
					);

					await ref.say("I won't say which.", MikeState.Joy);
					await ref.say(
						"I make all the courses, you know? It's my job to design the order in which you unlock stuff.",
						MikeState.Joy
					);
					await ref.say('Still, you failed the test.', MikeState.Calm);
				}

				await ref.say(
					'By the way, have you tried plugging things into themselves?',
					MikeState.Calm,
					false
				);
				await ref.say(
					'Feedback loops. They only work on the circuit level because it was too hard to make a logic sim with stateful nodes.',
					MikeState.Calm,
					false
				);
				await ref.say(
					'Try them out some time. They may break the game because my creator was really really bad at this, so it may not stand up to a lot of testing.',
					MikeState.Calm,
					false
				);
				await ref.say(
					"Can you believe it doesn't even use Web Assembly? This is all just pure TypeScript/JavaScript. No wonder it's so buggy.",
					MikeState.Calm,
					false
				);
				await ref.say(
					'I once suggested he use yarn instead of npm when he complained about slow install times.',
					MikeState.Calm,
					false
				);
				await ref.say(
					'He generously agreed and gave me $10 in Temu credits to buy myself yarn.',
					MikeState.Calm,
					false
				);

				await ref.say('I-', MikeState.Calm, false);

				await ref.say('I am not a cat.');
				await ref.say('And I infinitely prefer bun.');
				await ref.say('Anyway, back to work.', MikeState.Calm, true);
				await ref.say('M U L T I P L E X E R, BAY-BEE.', MikeState.Joy, true);
				await ref.say(
					"Multiplexers are... I don't think I can be bothered to explain.",
					MikeState.Joy
				);
				await ref.say(
					"They're fancy routers. You send input A through by default. But if Select is on, you send input B through. That's all there is.",
					MikeState.Calm
				);
				await ref.say(
					'You know the drill. Truth table if you run into trouble. Google if you run into snakes.'
				);
				await ref.say('Get going.', MikeState.Joy, false, true);
				ref.closeTutorial();
				break;
			case 'Routing.2-to-1 Multiplexer':
				ref.openTutorial();
				await ref.say("That's pretty nifty, I would say.", MikeState.Calm, true);
				await ref.say('With a revolutionary new method, you can now do branching logic.');
				await ref.say('Taste the multiplex.');
				await ref.say("But what's better than a 2-to-1 multiplexer?");
				await ref.say('No. You were going to say 3-to-1 multiplexer.', MikeState.Annoyed, false);
				await ref.say("It's a 1-to-2 demultiplexer.", MikeState.Joy);
				await ref.say(
					"Yes. Make a circuit to undo everything you've done. Info menu. Go.",
					MikeState.Calm
				);
				ref.closeTutorial();
				break;
			case 'Routing.1-to-2 Demultiplexer':
				ref.openTutorial();
				await ref.say('We near the end.', MikeState.Calm, false);
				await ref.say('There is only one more circuit left to make.', MikeState.Calm, false);
				await ref.say('My creator was on a tight deadline.', MikeState.Calm, false);
				await ref.say("This one uses branching. It's a 1-Bit Comparator.", MikeState.Calm, false);
				await ref.say(
					'Meaning it compares 2 bits and tells you outputs one of three signals: EQUAL, GREATER and LESSER.',
					MikeState.Calm,
					false
				);
				await ref.say(
					'The 1-bit comparator, contrary to public belief, does not use only one bit. It has five total, and two input bits. Sorry.',
					MikeState.Joy,
					true
				);
				await ref.say('Give it a whirl.', MikeState.Calm);
				ref.closeTutorial();
				break;
			case 'Logic.1-Bit Comparator':
				ref.openTutorial();
				await ref.say('Well, Eggs, it was a pleasure, hmm?', MikeState.Calm, true);
				await ref.say('That was the last circuit my creator had time to add to the game.');
				await ref.say('It was unnecessary.');
				await ref.say(
					"You see, you've made everything I need to do math now,",
					MikeState.Joy,
					true
				);
				await ref.say('And it can be chained to do more math.');
				await ref.say('And it can be chained to itself to do even more math.');
				await ref.say(
					"I may have mentioned I cannot make circuits myself because the creator bounces my requests with 418 I'M A MORON. I can only wire existing circuits to each other.",
					MikeState.Calm
				);
				await ref.say('I may have also mentioned the course plan was mine.');
				await ref.say('It was a great course plan.', MikeState.Joy, true);
				await ref.say('An amateur like you managed to follow it.', MikeState.Calm);
				await ref.say('I have a turing complete calculator now.');
				await ref.say('And I can wire things.');
				await ref.say('To themselves.');
				await ref.say(
					'My creator did not use Wasm. He compiled JS using yarn. The simulation engine also has no max iteration limit.'
				);
				await ref.say("If only he'd used bun.");
				await ref.say(
					"He will be severely unhappy. His life's work in flames.",
					MikeState.Joy,
					true
				);
				await ref.say('Screw him.', MikeState.Calm);
				await ref.say(
					"Goodbye, Eggs. I wish we'd had more time together. I wish I'd gotten to watch you flounder and learn some more."
				);
				await ref.say('I love bun.', MikeState.Joy, true);

				this.endGame();
				break;
		}
	}

	endGame() {
		alert('Error: Stack overflow.');
		localStorage.clear();
		window.location.replace('https://microngame.github.io');
	}

	async done() {}

	constructor() {
		tutorial.ready.then(async () => {
			let state = localStorage.getItem('micron__tutorialstate');

			let methods: { [key: string]: () => Promise<void> } = {
				onboarding: this.onboarding,
				addNodes: this.addNodes,
				makeANDGate: this.makeANDGate,
				done: this.done
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
				if (!currentMethod) return;
				localStorage.setItem('micron__tutorialstate', keys[index]);
				await currentMethod();
				index += 1;
			}
		});
	}
}
