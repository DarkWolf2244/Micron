<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconPlus from '~icons/tabler/sum';

	let { selected, data }: { selected: boolean; data: any } = $props();

	$effect(() => {
		console.log('And gate data');
		console.log(data);
	});
</script>

<GenericNode
	data={{
		label: 'Full-Bit Adder',
		icon: IconPlus,
		n_inputs: 3,
		n_outputs: 2,
		category: 'Arithmetic',
		input_labels: ['A', 'B', 'Carry-in'],
		output_labels: ['Sum', 'Carry-out'],
		active: data.active
	}}
	{selected}
/>
