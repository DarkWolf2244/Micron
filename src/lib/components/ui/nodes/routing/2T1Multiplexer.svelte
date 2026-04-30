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
		label: '2-to-1 Multiplexer',
		icon: IconMUX,
		n_inputs: 3,
		n_outputs: 1,
		input_labels: ['A', 'B', 'Select'],
		category: 'Routing',
		active: data.active
	}}
	{selected}
/>
