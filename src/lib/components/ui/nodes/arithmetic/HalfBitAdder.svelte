<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconPlus from '~icons/tabler/plus';

	let { selected, data }: { selected: boolean; data: any } = $props();

	$effect(() => {
		console.log('And gate data');
		console.log(data);
	});
</script>

<GenericNode
	data={{
		label: 'Half-Bit Adder',
		icon: IconPlus,
		n_inputs: 2,
		n_outputs: 2,
		category: 'Arithmetic',
		output_labels: ['Sum', 'Carry'],
		active: data.active
	}}
	{selected}
/>
