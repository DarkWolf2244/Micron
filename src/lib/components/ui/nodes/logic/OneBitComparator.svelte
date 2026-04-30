<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconGreater from '~icons/tabler/math-equal-greater';

	let { selected, data }: { selected: boolean; data: any } = $props();

	$effect(() => {
		console.log('And gate data');
		console.log(data);
	});
</script>

<GenericNode
	data={{
		label: '1-Bit Comparator',
		icon: IconGreater,
		n_inputs: 2,
		n_outputs: 3,
		category: 'Logic',
		input_labels: ['A', 'B'],
		output_labels: ['Equal', 'Greater', 'Less'],
		active: data.active
	}}
	{selected}
/>
