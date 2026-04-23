<script lang="ts">
	import GenericNode from '../GenericNode.svelte';

	let {
		selected,
		data
	}: {
		selected: boolean;
		data: {
			active: boolean;
		};
	} = $props();

	$effect(() => {
		console.log('One bit readout');
		console.log(data);
	});
</script>

<GenericNode
	{selected}
	data={{ label: data.active ? '1' : '0', category: 'Outputs', n_inputs: 1, active: data.active }}
/>
