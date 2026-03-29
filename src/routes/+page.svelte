<script lang="ts">
	import {
		SvelteFlow,
		Background,
		useSvelteFlow,
		type XYPosition,
		SvelteFlowProvider
	} from '@xyflow/svelte';
	import { flowManagerInstance } from '$lib/data/FlowManager.svelte';
	import './svelte-flow.css';
	import * as Card from '$lib/components/ui/card/index';
	import { onMount } from 'svelte';
	import GenericNode from '$lib/components/ui/nodes/GenericNode.svelte';

	import IconAnd from '~icons/tabler/logic-and';
	import GateAND from '$lib/components/ui/nodes/gates/AND.svelte';
	import GateOR from '$lib/components/ui/nodes/gates/OR.svelte';
	import GateXOR from '$lib/components/ui/nodes/gates/XOR.svelte';
	import GateNOT from '$lib/components/ui/nodes/gates/NOT.svelte';
	import * as Command from '$lib/components/ui/command/index.js';

	let flowManager = $state(flowManagerInstance);
	let nodeTypes = {
		generic: GenericNode,
		'gate/AND': GateAND,
		'gate/OR': GateOR,
		'gate/XOR': GateXOR,
		'gate/NOT': GateNOT
	};

	let { screenToFlowPosition } = useSvelteFlow();
	let mousePosition: XYPosition = { x: 0, y: 0 };

	let nodeRegistry: { gates: { [key: string]: string } } = {
		gates: {
			AND: 'gate/AND',
			OR: 'gate/OR',
			NOT: 'gate/NOT',
			XOR: 'gate/XOR'
		}
	};

	let nodeCategories = Object.keys(nodeRegistry);

	onMount(() => {
		flowManager.nodes = [
			...flowManager.nodes,
			{
				type: 'gate/AND',
				id: 'ID',
				position: {
					x: 0,
					y: 0
				},
				data: {
					label: 'AND',
					icon: IconAnd
				}
			},
			{
				type: 'gate/OR',
				id: 'ID2',
				position: {
					x: 0,
					y: 0
				},
				data: {
					label: 'AND',
					icon: IconAnd
				}
			},
			{
				type: 'gate/XOR',
				id: 'ID3',
				position: {
					x: 0,
					y: 0
				},
				data: {
					label: 'AND',
					icon: IconAnd
				}
			},
			{
				type: 'gate/NOT',
				id: 'ID4',
				position: {
					x: 0,
					y: 0
				},
				data: {
					label: 'AND',
					icon: IconAnd
				}
			}
		];
	});

	let addMenuOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'q' && e.altKey) {
			e.preventDefault();
			addMenuOpen = !addMenuOpen;
		}
	}

	function handleMouseover(e: MouseEvent) {
		mousePosition = { x: e.clientX, y: e.clientY };
	}

	function addNode(category: string, node: string) {
		console.log(category, node);
		let id = (nodeRegistry as any)[category][node];

		flowManagerInstance.addNode(id, screenToFlowPosition(mousePosition));
		addMenuOpen = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} onmouseover={handleMouseover} />
<div class="flex h-screen flex-col space-y-4">
	<h1 class="h1 p-2 text-center font-normal text-primary">
		<span class="tracking-widest">MICRON</span>
		<span class="h1 font-light! text-muted-foreground">/</span>
		<span class="h1 font-light text-muted-foreground">Untitled schematic</span>
	</h1>
	<SvelteFlow
		bind:nodes={flowManager.nodes}
		bind:edges={flowManager.edges}
		defaultEdgeOptions={{
			class: 'bg-primary',
			animated: true,
			type: "step"
		}}
		class="dark"
		{nodeTypes}
		deleteKey={['Delete', 'Backspace', 'x']}
		proOptions={{
			hideAttribution: true
		}}
	>
		<Background patternColor={'var(--primary)'} gap={36} />
	</SvelteFlow>
</div>

<Command.Dialog bind:open={addMenuOpen}>
	<Command.Input placeholder="Enter the name of a node to add..."></Command.Input>
	<Command.List>
		{#each nodeCategories as group}
			<Command.Group heading={group[0].toUpperCase() + group.slice(1)}>
				{#each Object.keys((nodeRegistry as unknown as any)[group]) as node}
					<Command.Item onclick={() => addNode(group, node)}>{node}</Command.Item>
				{/each}
			</Command.Group>
		{/each}
	</Command.List>
</Command.Dialog>
