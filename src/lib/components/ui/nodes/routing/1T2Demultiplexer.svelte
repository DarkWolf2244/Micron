<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconMUX from '~icons/icon-park-outline/trapezoid';

	let { selected, data }: { selected: boolean; data: any } = $props();

	$effect(() => {
		console.log('And gate data');
		console.log(data);
	});
</script>

<GenericNode
	data={{
		label: '1-to-2 Demultiplexer',
		icon: IconMUX,
		n_inputs: 2,
		n_outputs: 2,
		input_labels: ['Input', 'Select'],
		output_labels: ['A', 'B'],
		category: 'Routing',
		active: data.active
	}}
	{selected}
/>
