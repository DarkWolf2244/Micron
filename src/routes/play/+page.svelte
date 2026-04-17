<script lang="ts">
	import { Background, SvelteFlow, useSvelteFlow, type XYPosition } from '@xyflow/svelte';
	import PlayRibbon from './components/PlayRibbon.svelte';
	import { gameDataStore, nodeCategories, nodeRegistry, nodeTypes } from '$lib/data/game.svelte';
	import '../svelteFlow.css';

	import { onMount, type Component } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	import { addNodeToActiveSchematic } from '$lib/data/schematic.svelte';

	let activeSchematic = $derived(
		gameDataStore.data?.schematics.find((s) => s.id == gameDataStore.data?.activeSchematicID)
	);
	let modalAddNodeMenuOpen = $state(false);
	let mousePosition: XYPosition = $state({ x: 0, y: 0 });

	let { screenToFlowPosition } = useSvelteFlow();

	function handleWindowKeydown(e: KeyboardEvent) {
		if (e.key === 'q' && e.altKey) {
			e.preventDefault();
			modalAddNodeMenuOpen = !modalAddNodeMenuOpen;
		}
	}

	function handleWindowMousemove(e: MouseEvent) {
		mousePosition = { x: e.clientX, y: e.clientY };
	}

	function handleModalAddNodeMenuItemOnClick(group: string, item: string) {
		const type = group + '.' + item;
		addNodeToActiveSchematic(type, screenToFlowPosition(mousePosition));
		console.log(activeSchematic?.nodes);
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} onmousemove={handleWindowMousemove} />

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

<Command.Dialog bind:open={modalAddNodeMenuOpen}>
	<Command.Input placeholder="Enter the name of a node to add..."></Command.Input>
	<Command.List>
		{#each nodeCategories as group}
			<Command.Group heading={group}>
				{#each Object.keys(nodeRegistry[group]) as name}
					<Command.Item
						onclick={() => handleModalAddNodeMenuItemOnClick(group, name)}
						class="cursor-pointer">{name}</Command.Item
					>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
