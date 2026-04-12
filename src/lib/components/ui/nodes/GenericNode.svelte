<script lang="ts">
	import { Handle, Position, useUpdateNodeInternals } from '@xyflow/svelte';
	import { onMount, type Component } from 'svelte';

	let {
		data,
		selected
	}: {
		data: { label: string; icon?: Component; n_inputs: number; category: string };
		selected: boolean;
	} = $props();

	let Icon = $derived(data.icon);

	let handle_ids = $derived(
		data.n_inputs == 1
			? [{ id: 'input-handle-1', top: '' }]
			: [
					{ id: 'input-handle-1', top: 'top-[25%]!' },
					{ id: 'input-handle-2', top: 'top-[75%]!' }
				]
	);
</script>

<div
	class="flex flex-col rounded-lg bg-background p-2 outline {selected
		? ' outline-primary'
		: 'outline-transparent'} transition-all"
>
	<div class="flex flex-row items-center space-x-4 p-2">
		{#if Icon}
			<Icon />
		{/if}
		<div class="h-5 w-0.5 rounded-lg bg-primary"></div>
		<p>{data.label}</p>
	</div>
	<div class="text-[0.5rem] font-light text-primary">
		<p class="text-end">{data.category}</p>
	</div>
</div>
{#each handle_ids as handle}
	<Handle type="target" position={Position.Left} id={handle.id} class={handle.top} />
{/each}
<Handle type="source" position={Position.Right} id="handle-output" />
