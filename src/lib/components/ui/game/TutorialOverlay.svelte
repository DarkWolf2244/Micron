<script lang="ts">
	import { MikeState, tutorial } from '$lib/data/tutorial.svelte';
	import { type DotLottie, DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
	import gsap from 'gsap';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import IconChevronDown from '~icons/tabler/chevron-down';

	const mikeStateMap = ['mike/MikeAwake.json', 'mike/MikeHappy.json', 'mike/MikeAnnoyed.json'];
	let preloadedLotties: string[] = $state([]);
	let data: {
		isTutorialVisible: boolean;
		lottieRef?: DotLottie;
		lottieSrc?: string;
		messageState: 'none' | 'animating-in' | 'dismissable' | 'animating-out' | 'complete';
		message?: string;
		mikeState: number;
		introExists: boolean;
		outroExists: boolean;

		messageFinished?: Promise<void>;
		messageFinishedResolver?: () => void;

		_gsapAnimation?: gsap.core.Tween;
		_lottieAnimationLoaded?: Promise<void>;
		_lottieAnimationLoadedResolver?: () => void;
	} = $state({
		isTutorialVisible: false,
		messageState: 'none',
		mikeState: MikeState.Calm,
		introExists: false,
		outroExists: false
	});

	function openTutorial() {
		data.isTutorialVisible = true;
		gsap.to('.tutorial-bar', { yPercent: 0, autoAlpha: 1, ease: 'expo.out', duration: 0.8 });
	}

	function closeTutorial() {
		data.isTutorialVisible = false;
		gsap.to('.tutorial-bar', {
			yPercent: 110,
			autoAlpha: 0,
			ease: 'expo.out',
			duration: 0.6
		});
	}

	async function say(
		message: string,
		mikeState?: number,
		transitionIn?: boolean,
		transitionOut?: boolean
	) {
		const state = mikeState === undefined ? data.mikeState : mikeState;
		const introExists = transitionIn === undefined ? false : transitionIn;
		const outroExists = transitionOut === undefined ? false : transitionOut;
		data.message = message;
		data.mikeState = state;
		data.messageState = 'animating-in';
		data.introExists = introExists;
		data.outroExists = outroExists;

		const newSrc = preloadedLotties[data.mikeState] || mikeStateMap[data.mikeState];

		const srcChanged = data.lottieSrc !== newSrc;

		data.lottieSrc = newSrc;
		await tick();

		data._gsapAnimation = gsap.to('.animate-in', { opacity: 1, duration: 0.05, stagger: 0.05 });
		data._gsapAnimation.then(() => {
			if (data.messageState == 'animating-in') {
				data.messageState = 'dismissable';
			}
		});

		data.lottieRef?.setMode('forward');
		data.lottieRef?.setFrame(0);

		if (srcChanged) {
			await data._lottieAnimationLoaded;
			console.log('Awaited load animation');
		}
		if (transitionIn) {
			data.lottieRef?.play();
		} else {
			data.lottieRef?.setFrame(data.lottieRef?.totalFrames - 1);
		}

		console.log('Playing', data.lottieRef?.currentFrame);

		data._lottieAnimationLoaded = new Promise((resolve, reject) => {
			data._lottieAnimationLoadedResolver = resolve;
		});

		data.messageFinished = new Promise<void>((resolve, reject) => {
			data.messageFinishedResolver = resolve;
		});

		return data.messageFinished;
	}

	onMount(() => {
		gsap.set('.tutorial-bar', { yPercent: 110, autoAlpha: 0 });

		data._lottieAnimationLoaded = new Promise((resolve, reject) => {
			data._lottieAnimationLoadedResolver = resolve;
		});

		data.lottieRef?.addEventListener('ready', () => {
			if (data.lottieRef && !tutorial.ref) {
				onReady();
			}
		});

		data.lottieRef?.addEventListener('load', () => {
			console.log('Loaded now.');

			const resolve = data._lottieAnimationLoadedResolver!;
			resolve();
		});

		data.lottieRef?.addEventListener('complete', () => {
			console.log('Finished lottie');

			if (data.introExists && data.messageState == 'animating-in') {
				data.messageState = 'dismissable';
			}

			if (data.outroExists && data.messageState == 'animating-out') {
				console.log('Resolving', data.message);

				data.messageState = 'none';

				data.introExists = false;
				data.outroExists = false;
				data.message = '';

				data._lottieAnimationLoaded = new Promise((resolve, reject) => {
					data._lottieAnimationLoadedResolver = resolve;
				});

				const resolve = data.messageFinishedResolver!;
				console.log('Resolver: ', resolve);
				resolve();
				console.log('Resolved?');
				data.messageFinishedResolver!();
			}

			data.lottieRef?.setSpeed(1);
		});

		Promise.all(
			mikeStateMap.map(async (path) => {
				const response = await fetch(path);
				const blob = await response.blob();
				return URL.createObjectURL(blob);
			})
		).then((urls) => {
			preloadedLotties = urls;
		});
	});

	function onReady() {
		let ref = {
			openTutorial: openTutorial,
			say: say,
			closeTutorial: closeTutorial
		};
		tutorial.ref = ref;
		const resolve = tutorial.resolveReady!;
		resolve();
	}

	function onClick() {
		switch (data.messageState) {
			case 'animating-in':
				data.messageState = 'dismissable';
				data.lottieRef?.setFrame(data.lottieRef.totalFrames - 1);
				data._gsapAnimation?.progress(1.0);
				break;
			case 'dismissable':
				if (data.outroExists) {
					data.messageState = 'animating-out';
					data.lottieRef?.setMode('reverse');
					data.lottieRef?.setFrame(data.lottieRef.totalFrames - 150);
					data.lottieRef?.setSpeed(1);
					data.lottieRef?.play();
					console.log('Reversing');
					data._gsapAnimation?.progress(1.0);
					data._gsapAnimation?.timeScale(8.0).reverse();
				} else {
					console.log('Resolving', data.message);

					data.messageState = 'none';

					data.introExists = false;
					data.outroExists = false;
					data.lottieRef?.setFrame(0);
					data.message = '';

					data._lottieAnimationLoaded = new Promise((resolve, reject) => {
						data._lottieAnimationLoadedResolver = resolve;
					});

					const resolve = data.messageFinishedResolver!;
					resolve();
				}
		}
	}
</script>

<svelte:head>
	{#each mikeStateMap as state}
		<link rel="preload" href={state} as="fetch" crossorigin="anonymous" />
	{/each}
</svelte:head>

<div
	class="tutorial-bar fixed right-0 bottom-0 left-0 z-70 flex h-[clamp(8rem,22vh,14rem)] w-full flex-row items-center justify-center p-2 {data.isTutorialVisible
		? 'pointer-events-auto'
		: 'pointer-events-none'}"
	style="opacity: 0; visibility: hidden;"
	onclick={onClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick();
		}
	}}
	role="button"
	tabindex={data.isTutorialVisible ? 0 : -1}
	aria-label="Continue tutorial"
>
	<div
		class="relative flex h-full min-h-0 w-full flex-row overflow-hidden rounded-lg border {data.isTutorialVisible
			? 'border-primary'
			: 'border-transparent'} {data.messageState == 'dismissable'
			? 'cursor-pointer'
			: ''} bg-black shadow-2xl shadow-black transition-all duration-1000"
	>
		<div
			class="mike-bounce flex h-full w-[clamp(5rem,18vw,10rem)] shrink-0 flex-row items-center justify-center p-2 sm:p-5"
		>
			<DotLottieSvelte
				src={data.lottieSrc || ''}
				dotLottieRefCallback={(ref) => (data.lottieRef = ref)}
			/>
		</div>
		<div class="h-full w-0.5 bg-primary"></div>
		<div class="flex min-w-0 flex-1 flex-row items-center justify-center overflow-y-auto p-2 pr-12">
			<p
				class="max-h-full w-full font-mono text-sm leading-relaxed wrap-break-word whitespace-pre-wrap sm:text-base md:text-lg"
			>
				{#each data.message as c}
					<span class="animate-in font-mono whitespace-pre-wrap opacity-0 select-none">{c}</span>
				{/each}
			</p>
		</div>
		{#if data.messageState == 'dismissable'}
			<div transition:fade class="absolute right-2 bottom-2">
				<IconChevronDown class="size-8 animate-bounce text-primary" />
			</div>
		{/if}
	</div>
</div>

<style>
	.mike-bounce {
		animation: bounce 1s infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(-5%);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		50% {
			transform: none;
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
	}
</style>
