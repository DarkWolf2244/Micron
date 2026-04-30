<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconVote from '~icons/material-symbols/how-to-vote';

	let { selected, data }: { selected: boolean; data: any } = $props();

	$effect(() => {
		console.log('And gate data');
		console.log(data);
	});
</script>

<GenericNode
	data={{
		label: 'Majority Gate',
		icon: IconVote,
		n_inputs: 3,
		n_outputs: 1,
		category: 'Logic',
		input_labels: ['A', 'B', 'C'],
		output_labels: ['Output'],
		active: data.active
	}}
	{selected}
/>
