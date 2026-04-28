<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconNOR from '~icons/tabler/logic-nor';

	let { selected, data }: { selected: boolean; data: any } = $props();

	$effect(() => {
		console.log(data);
	});
</script>

<GenericNode
	data={{
		label: 'NOR',
		icon: IconNOR,
		n_inputs: 2,
		category: 'Gate',
		active: data.active,
		topTitle: 'Test'
	}}
	{selected}
	topTitle="Test"
/>
