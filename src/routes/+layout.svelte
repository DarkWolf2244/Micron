<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import Overlay from '$lib/components/ui/game/Overlay.svelte';
	import { gsap } from 'gsap';

	import { CustomEase } from 'gsap/CustomEase';
	// CustomBounce requires CustomEase
	import { CustomBounce } from 'gsap/CustomBounce';
	// CustomWiggle requires CustomEase
	import { CustomWiggle } from 'gsap/CustomWiggle';
	import { RoughEase, ExpoScaleEase, SlowMo } from 'gsap/EasePack';

	import { SplitText } from 'gsap/SplitText';
	import { TextPlugin } from 'gsap/TextPlugin';
	import { onMount } from 'svelte';
	import { gameDataStore } from '$lib/data/game.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	onMount(() => {
		gsap.registerPlugin(
			SplitText,
			TextPlugin,
			RoughEase,
			ExpoScaleEase,
			SlowMo,
			CustomEase,
			CustomBounce,
			CustomWiggle
		);
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{#if gameDataStore.loadingGameData}
	<div
		class="flex min-h-screen w-full flex-auto flex-col items-center-safe justify-center gap-y-8 bg-background p-4"
	>
		<h1 class="h1 slow-animate-in text-primary">Loading data...</h1>
		<Spinner class="size-16 text-primary" />
	</div>
{:else}
	<SvelteFlowProvider>
		<div class="overflow-hidden relative">
			{@render children()}
		</div>
	</SvelteFlowProvider>
{/if}

<Overlay />
<Toaster />
<div class="small-screen-warning" role="status" aria-live="polite">
	<strong>Micron needs more room.</strong>
	<span>Use a wider or taller screen for reliable circuit editing.</span>
</div>
