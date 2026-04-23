<script lang="ts">
	import { Handle, Position, useUpdateNodeInternals } from '@xyflow/svelte';
	import { onMount, type Component } from 'svelte';

	let {
		data,
		selected
	}: {
		data: {
			label: string;
			icon?: Component;
			n_inputs: number;
			n_outputs?: number;
			category: string;
			active?: boolean;
		};
		selected: boolean;
	} = $props();

	let Icon = $derived(data.icon);

	let input_handle_ids = $derived.by(() => {
		const count = Math.max(1, data.n_inputs ?? 1);

		return Array.from({ length: count }, (_, index) => ({
			id: `input#${index}`,
			top: `${((index + 1) / (count + 1)) * 100}%`
		}));
	});

	let output_handle_ids = $derived.by(() => {
		const count = Math.max(1, data.n_outputs ?? 1);

		return Array.from({ length: count }, (_, index) => ({
			id: `output#${index}`,
			top: `${((index + 1) / (count + 1)) * 100}%`
		}));
	});


</script>

<div
	class="flex flex-col rounded-lg bg-background p-2 outline {selected || data.active
		? ' outline-primary'
		: 'outline-transparent'} transition-all"
>
	<div class="flex flex-row items-center space-x-4 p-2">
		{#if Icon}
			<Icon />
		{/if}
		<div class="h-5 w-0.5 rounded-lg {data.active ? 'bg-primary' : ''}"></div>
		<p>{data.label}</p>
	</div>
	<div class="text-[0.5rem] font-light text-primary">
		<p class="text-end">{data.category}</p>
	</div>
</div>
{#each input_handle_ids as handle}
	<Handle type="target" position={Position.Left} id={handle.id} style="top: {handle.top}" />
{/each}
{#each output_handle_ids as handle}
	<Handle type="source" position={Position.Right} id={handle.id} style={`top: ${handle.top};`} />
{/each}
