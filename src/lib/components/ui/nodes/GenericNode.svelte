<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import { type Component } from 'svelte';

	type HandleInput = number | string[];

	function buildHandles(
		countOrLabels: HandleInput | undefined,
		labels: string[] | undefined,
		prefix: 'input' | 'output'
	) {
		const handleLabels = Array.isArray(countOrLabels) ? countOrLabels : labels;
		const count = Array.isArray(countOrLabels)
			? countOrLabels.length
			: (countOrLabels ?? handleLabels?.length ?? 1);

		return Array.from({ length: Math.max(0, count) }, (_, index) => ({
			id: `${prefix}#${index}`,
			label: handleLabels?.[index],
			top: `${((index + 1) / (count + 1)) * 100}%`
		}));
	}

	let {
		data,
		selected,
		topTitle,
		title = $bindable<string | undefined>()
	}: {
		data: {
			label: string;
			icon?: Component;
			n_inputs?: HandleInput;
			n_outputs?: HandleInput;
			input_labels?: string[];
			output_labels?: string[];
			category: string;
			active?: boolean;
			title?: string;
		};
		selected: boolean;
		topTitle?: string;
		title?: string;
	} = $props();

	let Icon = $derived(data.icon);

	$effect(() => {
		if (title === undefined && data.title !== undefined) {
			title = data.title;
		}
	});

	$effect(() => {
		if (title !== undefined) {
			data.title = title;
		}
	});

	let input_handles = $derived.by(() => buildHandles(data.n_inputs, data.input_labels, 'input'));
	let output_handles = $derived.by(() =>
		buildHandles(data.n_outputs, data.output_labels, 'output')
	);
</script>

<div
	class="flex flex-col rounded-lg bg-background p-2 outline {data.active
		? ' outline-primary'
		: 'outline-transparent'} {selected ? 'outline-accent-foreground!' : ''} transition-all"
>
	{#if title !== undefined}
		<p class="w-full p-2 hover:cursor-text" contenteditable="true" bind:innerText={title}></p>
	{/if}
	<div class="flex flex-row items-center space-x-4 p-2">
		{#if Icon}
			<Icon class={data.active ? 'text-primary transition-colors' : ''} />
		{/if}
		<div
			class="{data.active ? 'h-5' : 'h-0'} w-0.5 rounded-lg {data.active
				? 'bg-primary'
				: ''} transition-all"
		></div>
		<p>{data.label}</p>
	</div>
	<div class="text-[0.5rem] font-light text-primary">
		<p class="text-end">{data.category}</p>
	</div>
</div>
{#each input_handles as handle}
	<Handle type="target" position={Position.Left} id={handle.id} style="top: {handle.top}" />
	{#if handle.label}
		<span
			class="pointer-events-none absolute right-[calc(100%+0.5rem)] z-10 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[0.6rem] font-medium whitespace-nowrap text-foreground shadow-sm"
			style="top: {handle.top}"
		>
			{handle.label}
		</span>
	{/if}
{/each}
{#each output_handles as handle}
	<Handle type="source" position={Position.Right} id={handle.id} style={`top: ${handle.top};`} />
	{#if handle.label}
		<span
			class="pointer-events-none absolute left-[calc(100%+0.5rem)] z-10 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[0.6rem] font-medium whitespace-nowrap text-foreground shadow-sm"
			style="top: {handle.top}"
		>
			{handle.label}
		</span>
	{/if}
{/each}
