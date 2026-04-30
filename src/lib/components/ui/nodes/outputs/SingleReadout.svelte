<script lang="ts">
	import { onMount } from 'svelte';
	import GenericNode from '../GenericNode.svelte';

	let {
		selected,
		data
	}: {
		selected: boolean;
		data: {
			active: boolean;
			title: string;
		};
	} = $props();

	$effect(() => {
		console.log('One bit readout');
		console.log(data);
	});

	onMount(() => {
		if (!data.title) {
			data.title = 'Untitled output';
		}
	});
</script>

<div class="item-center flex flex-row justify-center gap-2">
	<GenericNode
		{selected}
		bind:title={data.title}
		data={{
			label: data.active ? '1' : '0',
			category: 'Outputs',
			n_inputs: 1,
			n_outputs: 0,
			active: data.active
		}}
	/>
</div>
