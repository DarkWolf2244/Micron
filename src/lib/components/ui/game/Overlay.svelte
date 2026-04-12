<script lang="ts">
	import { overlayStore } from '$lib/data/overlay.svelte';
	import { onMount, tick } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { gsap } from 'gsap';
	import { Button } from '$lib/components/ui/button/index';

	function createSpring(stiffness: any, damping: any, mass: any) {
		return function (progress: any) {
			// GSAP progress goes from 0 to 1. We scale it up so the math
			// has room to calculate the "settling" of the spring.
			const t = progress * 10;

			// Calculate angular frequency and damping ratio
			const w0 = Math.sqrt(stiffness / mass);
			const zeta = damping / (2 * Math.sqrt(stiffness * mass));

			// Underdamped spring (it overshoots and bounces)
			if (zeta < 1) {
				const wd = w0 * Math.sqrt(1 - zeta * zeta);
				const B = zeta / Math.sqrt(1 - zeta * zeta);
				return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + B * Math.sin(wd * t));
			}

			// Critically damped or overdamped (no overshoot, no bounce)
			return 1 - Math.exp(-w0 * t) * (1 + w0 * t);
		};
	}

	async function runOnce(
		messageToDisplay: string,
		subtitle: string,
		primaryButtonLabel: string,
		then: any
	) {
		overlayStore.active = true;
		message = messageToDisplay;
		buttonLabel = primaryButtonLabel;
		buttonOnClick = then;
		subtitleMessage = subtitle;

		console.log(message);
		await tick();

		let children = headingMessage?.children;

		if (!children) return;

		Array.from(children).forEach((node, index) => {
			console.log(node);
			gsap.from(node, {
				y: 50,
				ease: createSpring(180, 90, 100),
				duration: 1,
				delay: (1 * index) / children.length
			});

			gsap.from(node, {
				opacity: 0,
				// ease: createSpring(180, 40, 100),

				duration: 1,
				delay: (1 * index) / children.length
			});
		});

		gsap.from('.subtitleMessage', { opacity: 0, y: 10, ease: 'expo.out', delay: 2 });
		gsap.from('.primaryButton', {
			opacity: 0,
			y: 10,
			ease: 'expo.out',
			delay: Math.max(timeToRead(subtitle), 3)
		});
	}

	onMount(() => {
		overlayStore.runOnce = runOnce;
	});

	let message = $state('');
	let headingMessage: HTMLHeadingElement | null = $state(null);

	let subtitleMessage: string | null = $state(null);
	let buttonLabel: string | null = $state(null);
	let buttonOnClick: any = $state(null);

	let timeToRead = (text: string) => (text.split(' ').length / 275) * 60;
</script>

<div
	class="pointer-events-none absolute inset-0 z-10 flex h-screen w-full flex-col items-center justify-center gap-y-4 transition-all {overlayStore.active
		? 'bg-[#000000e5]'
		: 'bg-transparent'} bg-blend-darken"
>
	{#if overlayStore.active}
		<div class="h1 text-8xl text-primary" bind:this={headingMessage}>
			{#each message as c}
				<h1 class="inline-block whitespace-pre">
					{c}
				</h1>
			{/each}
		</div>
		<p class="subtitleMessage">{subtitleMessage}</p>

		{#if buttonLabel}
			<div class="primaryButton pointer-events-auto z-20">
				<Button onclick={buttonOnClick}>{buttonLabel}</Button>
			</div>
		{/if}
	{/if}
</div>
