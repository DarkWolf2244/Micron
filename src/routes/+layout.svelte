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
{@render children()}

<Overlay />
