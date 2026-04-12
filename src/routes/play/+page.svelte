<script lang="ts">
	import { Background, SvelteFlow } from '@xyflow/svelte';
	import PlayRibbon from './components/PlayRibbon.svelte';
	import { gameDataStore } from '$lib/data/game.svelte';
	import '../svelteFlow.css';

	let activeSchematic = $derived(
		gameDataStore.data?.schematics.find((s) => s.id == gameDataStore.data?.activeSchematicID)
	);
</script>

{#if activeSchematic}
	<div class="flex min-h-screen w-full flex-col">
		<PlayRibbon></PlayRibbon>
		<SvelteFlow
			bind:nodes={activeSchematic.nodes}
			bind:edges={activeSchematic.edges}
			defaultEdgeOptions={{
				class: 'bg-primary',
				animated: true,
				type: 'step'
			}}
			class="dark grow"
			deleteKey={['Delete', 'Backspace', 'x']}
			proOptions={{
				hideAttribution: true
			}}
		>
			<Background patternColor={'var(--primary)'} gap={36} />
		</SvelteFlow>
	</div>
{/if}
