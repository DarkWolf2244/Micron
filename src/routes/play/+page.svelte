<script lang="ts">
	import { Background, SvelteFlow, useSvelteFlow, type XYPosition } from '@xyflow/svelte';
	import PlayRibbon from './components/PlayRibbon.svelte';
	import { gameDataStore, nodeCategories, nodeRegistry, nodeTypes } from '$lib/data/game.svelte';
	import '../svelteFlow.css';

	import * as Command from '$lib/components/ui/command';
	import { addNodeToActiveSchematic } from '$lib/data/schematic.svelte';
	const isMac = navigator.userAgent.toLowerCase().includes('mac');
	const altKey = isMac ? '⌥' : 'Alt';

	import IconAlert from '~icons/tabler/alert-circle';
	import * as Kbd from '$lib/components/ui/kbd/';
	import { onMount, untrack } from 'svelte';
	import { Simulator } from '$lib/data/simulation.svelte';

	let activeSchematic = $derived(
		gameDataStore.data?.schematics.find((s) => s.id == gameDataStore.data?.activeSchematicID)
	);
	let modalAddNodeMenuOpen = $state(false);
	let _modalAddNodeMenuUsedButton = $state(false);

	let mousePosition: XYPosition = $state({ x: 0, y: 0 });

	let { screenToFlowPosition } = useSvelteFlow();

	function handleWindowKeydown(e: KeyboardEvent) {
		if (e.key === 'q' && e.altKey) {
			e.preventDefault();
			modalAddNodeMenuLaunch();
		}
	}

	function modalAddNodeMenuLaunch(usedButton?: boolean) {
		modalAddNodeMenuOpen = true;
		_modalAddNodeMenuUsedButton = usedButton || false;
	}

	function handleWindowMousemove(e: MouseEvent) {
		mousePosition = { x: e.clientX, y: e.clientY };
	}

	function handleModalAddNodeMenuItemOnClick(group: string, item: string) {
		const type = group + '.' + item;
		addNodeToActiveSchematic(type, screenToFlowPosition(mousePosition));
		console.log(activeSchematic?.nodes);
	}

	let simulator: Simulator | null = null;
	let tickInterval: ReturnType<typeof setInterval> | null = null;

	function rebuildSimulator() {
		if (tickInterval) clearInterval(tickInterval);
		const nodes = activeSchematic?.nodes || [];
		const edges = activeSchematic?.edges || [];
		if (nodes.length === 0) {
			simulator = null;
			return;
		}
		simulator = new Simulator(nodes, edges);
		tickInterval = setInterval(() => simulator?.tick(), 1000);
	}

	let nodeIds = $derived(activeSchematic?.nodes?.map((n) => n.id).join(',') ?? '');
	let edgeIds = $derived(activeSchematic?.edges?.map((e) => e.id).join(',') ?? '');

	$effect(() => {
		void nodeIds;
		void edgeIds;
		// untrack so rebuildSimulator's reads of activeSchematic.nodes/edges
		// don't become tracked dependencies of this effect
		untrack(() => rebuildSimulator());
	});

	onMount(() => {
		return () => {
			if (tickInterval) clearInterval(tickInterval);
		};
	});
</script>

<svelte:window onkeydown={handleWindowKeydown} onmousemove={handleWindowMousemove} />

{#if activeSchematic}
	<div class="flex min-h-screen w-full flex-col">
		<PlayRibbon onModalAddNodeMenuLaunch={modalAddNodeMenuLaunch}></PlayRibbon>
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
	{#if _modalAddNodeMenuUsedButton}
		<div class="mt-4 rounded-2xl bg-muted p-2 text-xs">
			<p>
				<IconAlert class="inline text-primary" /> It's faster to use the keyboard shortcut: <Kbd.Root
					class="bg-background">{altKey} + Q</Kbd.Root
				>.
			</p>
		</div>
	{/if}
</Command.Dialog>
