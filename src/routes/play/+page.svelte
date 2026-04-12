<script lang="ts">
	import { Background, SvelteFlow, type NodeTypes } from '@xyflow/svelte';
	import PlayRibbon from './components/PlayRibbon.svelte';
	import { gameDataStore } from '$lib/data/game.svelte';
	import '../svelteFlow.css';
	import GateAND from '$lib/components/ui/nodes/gates/GateAND.svelte';
	import GateOR from '$lib/components/ui/nodes/gates/GateOR.svelte';
	import GateXOR from '$lib/components/ui/nodes/gates/GateXOR.svelte';
	import GenericNode from '$lib/components/ui/nodes/GenericNode.svelte';
	import GateNOT from '$lib/components/ui/nodes/gates/GateNOT.svelte';
	import TransistorNMOS from '$lib/components/ui/nodes/transistors/TransistorNMOS.svelte';
	import TransistorPMOS from '$lib/components/ui/nodes/transistors/TransistorPMOS.svelte';
	import InputToggleButton from '$lib/components/ui/nodes/inputs/InputToggleButton.svelte';

	import { onMount } from 'svelte';

	let activeSchematic = $derived(
		gameDataStore.data?.schematics.find((s) => s.id == gameDataStore.data?.activeSchematicID)
	);

	let nodeTypes = {
		generic: GenericNode,
		'gate/AND': GateAND,
		'gate/OR': GateOR,
		'gate/XOR': GateXOR,
		'gate/NOT': GateNOT,
		'transistor/NMOS': TransistorNMOS,
		'transistor/PMOS': TransistorPMOS,
		'input/ToggleButton': InputToggleButton
	};
	onMount(() => {
		activeSchematic?.nodes.push({
			id: crypto.randomUUID(),
			data: {},
			position: {
				x: 50,
				y: 50
			},
			type: 'gate/AND'
		});
	});
</script>

{#if activeSchematic}
	<div class="flex min-h-screen w-full flex-col">
		<PlayRibbon></PlayRibbon>
		<SvelteFlow
			bind:nodes={activeSchematic.nodes}
			bind:edges={activeSchematic.edges}
			{nodeTypes}
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
