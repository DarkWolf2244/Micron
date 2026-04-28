<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { expoOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
	import type { DotLottie } from '@lottiefiles/dotlottie-web';
	import {
		MikeState,
		tutorialStore,
		type LaunchOptions,
		type MikeStateValue
	} from '$lib/data/tutorial.svelte';
	import gsap from 'gsap';
	import IconContinue from '~icons/tabler/chevron-down';

	// ── State ──────────────────────────────────────────────
	let isVisible = $state(false);
	let content = $state('');
	let allowContinue = $state(false);

	// Lottie instance ref — captured via dotLottieRefCallback
	let lottie: DotLottie | null = $state(null);

	// The src we feed to DotLottieSvelte (reactive prop drives loading)
	const mikeStateMap = ['mike/MikeAwake.json', 'mike/MikeHappy.json', 'mike/MikeAnnoyed.json'];
	let currentMikeState: MikeStateValue = $state(MikeState.Awake);
	let currentSrc = $derived(mikeStateMap[currentMikeState]);

	// Transition options for the current step
	let stepTransitionOut = false;

	// The resolve callback for the active step's Promise
	let resolveStep: (() => void) | null = null;

	// ── Ref + load coordination ────────────────────────────
	let pendingReadyResolve: (() => void) | null = null;

	function onLottieRef(ref: DotLottie) {
		lottie = ref;
		// 'load' fires after this callback — safe to register here
		const onLoad = () => {
			ref.removeEventListener('load', onLoad);
			if (pendingReadyResolve) {
				pendingReadyResolve();
				pendingReadyResolve = null;
			}
		};
		ref.addEventListener('load', onLoad);
	}

	/** Resolves when DotLottie ref is captured AND initial animation loads. */
	function waitForMountAndLoad(): Promise<void> {
		return new Promise((resolve) => {
			pendingReadyResolve = resolve;
		});
	}

	// ── Lottie helpers ─────────────────────────────────────

	/** One-shot Promise for a DotLottie event. */
	function once(event: string): Promise<void> {
		return new Promise((resolve) => {
			if (!lottie) {
				resolve();
				return;
			}
			const handler = () => {
				lottie!.removeEventListener(event as any, handler);
				resolve();
			};
			lottie.addEventListener(event as any, handler);
		});
	}

	/** Play forward from frame 0 and wait for `complete`. */
	async function playForward(): Promise<void> {
		if (!lottie) return;
		lottie.setLoop(false);
		lottie.setMode('forward');
		lottie.stop();
		const done = once('complete');
		lottie.play();
		await done;
	}

	/** Play in reverse from the last frame and wait for `complete`. */
	async function playReverse(): Promise<void> {
		if (!lottie) return;
		lottie.setLoop(false);
		lottie.setMode('reverse');
		lottie.setFrame(lottie.totalFrames - 1);
		const done = once('complete');
		lottie.play();
		await done;
	}

	/** Jump directly to the last frame (no animation). */
	function seekToEnd(): void {
		if (!lottie) return;
		lottie.pause();
		lottie.setFrame(lottie.totalFrames - 1);
	}

	// ── Typewriter ─────────────────────────────────────────

	/**
	 * Runs the gsap stagger typewriter on the current `.animate-in`
	 * elements and returns the total duration in ms.
	 */
	function runTypewriter(): number {
		const duration = Math.max(0, content.length - 1) * 100; // stagger 0.1s each
		gsap.set('.animate-in', {
			opacity: 1,
			stagger: 0.1
		});
		return duration;
	}

	// ── Launch ─────────────────────────────────────────────

	async function launch(
		text: string,
		mikeState: MikeStateValue,
		options?: LaunchOptions
	): Promise<void> {
		const transitionIn = options?.transitionIn ?? true;
		stepTransitionOut = options?.transitionOut ?? false;

		const mikeChanged = mikeState !== currentMikeState;
		const needsMount = !isVisible;

		// Update content and reset continue state
		content = text;
		allowContinue = false;

		if (needsMount) {
			// First time mounting the component
			currentMikeState = mikeState;
			const ready = waitForMountAndLoad();
			isVisible = true;
			await ready;
		} else if (mikeChanged) {
			// Component already mounted but Mike state changing
			const loaded = once('load');
			currentMikeState = mikeState;
			await loaded;
		}
		// else: component mounted and Mike state unchanged - proceed immediately

		// Drive the lottie animation (fire-and-forget for concurrent text/animation)
		if (transitionIn) {
			if (lottie) {
				lottie.setLoop(false);
				lottie.setMode('forward');
				lottie.stop();
				lottie.play();
			}
		} else {
			seekToEnd();
		}

		// Start typewriter immediately (concurrent with animation)
		await tick();
		const typewriterMs = runTypewriter();

		// Chevron appears 500ms after last character types in
		setTimeout(() => {
			allowContinue = true;
		}, typewriterMs + 500);

		// Wait for user click
		return new Promise<void>((resolve) => {
			resolveStep = resolve;
		});
	}

	// ── Click handler ──────────────────────────────────────

	async function onClick() {
		if (!allowContinue) return;
		allowContinue = false;

		// Play reverse animation if requested, but keep component mounted
		if (stepTransitionOut) {
			await playReverse();
		}

		// Resolve the step Promise → next step chains
		if (resolveStep) {
			resolveStep();
			resolveStep = null;
		}
	}

	// ── Mount ──────────────────────────────────────────────

	onMount(() => {
		tutorialStore.launch = launch;
	});
</script>

<div
	class="absolute bottom-0 left-0 flex h-[20%] w-full flex-row items-center justify-center p-2 outline-none {allowContinue
		? 'cursor-pointer'
		: ''}"
	onclick={onClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick();
		}
	}}
	role="button"
	tabindex={isVisible ? 0 : -1}
	aria-label="Continue tutorial"
>
	{#if isVisible}
		<div
			class="relative flex h-full w-full flex-row border border-primary bg-black p-2"
			transition:fly={{ y: 150, easing: expoOut, duration: 800 }}
		>
			<div class="aspect-square w-[25%] animate-bounce">
				<DotLottieSvelte
					src={currentSrc}
					autoplay={false}
					loop={false}
					dotLottieRefCallback={onLottieRef}
				/>
			</div>
			<div class="flex h-full flex-col items-center justify-center rounded-lg p-4">
				<div class="h-full w-1 rounded-lg bg-primary"></div>
			</div>
			<div class="flex h-full w-[75%] flex-row items-center justify-center">
				<div class="h4 flex flex-row font-mono font-extralight!">
					{#key content}
						{#each content as c, i (i)}
							<span
								class="animate-in inline-block font-mono font-light whitespace-pre"
								style:opacity={0}>{c}</span
							>
						{/each}
					{/key}
				</div>
			</div>
			{#if allowContinue}
				<div class="contents" in:fade>
					<IconContinue class="absolute right-2 bottom-2 size-8 animate-bounce text-primary"
					></IconContinue>
				</div>
			{/if}
		</div>
	{/if}
</div>