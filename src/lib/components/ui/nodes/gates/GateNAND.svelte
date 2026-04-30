<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconNAND from '~icons/tabler/logic-nand';

	let { selected, data }: { selected: boolean; data: any } = $props();

	$effect(() => {
		console.log(data);
	});
</script>

<GenericNode
	data={{
		label: 'NAND',
		icon: IconNAND,
		n_inputs: 2,
		category: 'Gate',
		active: data.active,
	}}
	{selected}
/>
