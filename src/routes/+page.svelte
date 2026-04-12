<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import IconPlay from '~icons/tabler/player-play-filled';
	import IconHelpCircle from '~icons/tabler/help-circle-filled';
	import IconBullet from '~icons/tabler/diamonds-filled';
	import Overlay from '$lib/components/ui/game/Overlay.svelte';
	import { gameDataStore, initializeNewSave } from '$lib/data/game.svelte';
	import { overlayStore } from '$lib/data/overlay.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import gsap from 'gsap';
	onMount(() => {
		if (gameDataStore.data) {
			goto('/play');
		}
	});

	gsap;
</script>

<svelte:head><title>Micron</title></svelte:head>

{#if gameDataStore.loadingGameData}
	<div
		class="flex min-h-screen w-full flex-auto flex-col items-center-safe justify-center gap-y-8 bg-background p-4"
	>
		<h1 class="h1 slow-animate-in text-primary">Loading...</h1>
	</div>
{:else if gameDataStore.data === null}
	<div
		class="flex min-h-screen w-full flex-auto flex-col items-center-safe justify-center gap-y-8 bg-background p-4"
	>
		<div class="w-[60%] object-cover"><img src="micron_banner.png" alt="Micron banner" /></div>
		<hr class="w-[60%] bg-primary" />
		<div class="flex flex-col items-center justify-center gap-y-4 rounded-lg bg-muted p-4">
			<h2 class="h4 font-normal!">
				A web-based game where you build increasingly complex electronic circuits, then build more
				circuits on top of those until you make something cool.
			</h2>
			<div class="flex w-fit flex-row gap-x-4">
				<Button
					class=""
					onclick={async () => {
						await overlayStore.runOnce(
							'Welcome to Micron.',
							'No save was detected. Would you like to create a new one?',
							'Yes, continue',
							() => {
								initializeNewSave();
								goto('/play');
							}
						);
					}}><IconPlay />Start</Button
				>
				<Button variant="outline" href="about"><IconHelpCircle /> Learn more</Button>
			</div>
		</div>
		<div
			class="flex flex-col items-center justify-center gap-2 rounded-lg border-b border-primary bg-muted p-2 text-center"
		>
			<p class="text-gray-300">
				<IconBullet class="mx-2 inline text-primary" />Made for
				<a href="https://flavortown.hackclub.com" class="text-primary underline">Flavortown</a>, a
				Hack Club event, with <span class="text-primary">SvelteKit</span>,
				<span class="text-primary">shadcn/ui</span>, and
				<span class="text-primary">Svelte Flow</span>.
			</p>
		</div>
	</div>
{/if}
