<script lang="ts">
	import { Handle, Position, useUpdateNodeInternals } from '@xyflow/svelte';
	import { onMount, type Component } from 'svelte';

	let {
		data,
		selected
	}: {
		data: { label: string; n_inputs: number; category: string };
		selected: boolean;
	} = $props();

	let state = $state(false);
</script>

<div
	class="flex flex-col rounded-lg bg-background p-2 outline {selected
		? ' outline-primary'
		: 'outline-transparent'} transition-all"
>
	<div class="flex flex-row items-center space-x-4 p-2">
		<div class="flex flex-row items-center justify-center">
			<button
				class="cursor-pointer rounded-lg border {state
					? 'border-primary'
					: 'border-border'} p-2 text-primary"
				onclick={() => (state = !state)}>Toggle</button
			>
		</div>
		<div
			class=" w-0.5 rounded-lg transition-all {state
				? 'h-5 bg-primary'
				: 'h-0 bg-foreground'} duration-300 ease-in-out"
		></div>
		<p>{state ? 'On' : 'Off'}</p>
	</div>
	<div class="text-[0.5rem] font-light text-primary">
		<p class="text-end">Inputs</p>
	</div>
</div>
<Handle type="source" position={Position.Right} id="handle-output" />
