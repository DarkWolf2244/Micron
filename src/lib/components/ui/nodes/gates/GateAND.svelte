<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconAND from '~icons/tabler/logic-and';

	let { selected, data }: { selected: boolean; data: any } = $props();

	$effect(() => {
		console.log("And gate data");
		console.log(data);
	});
</script>

<GenericNode
	data={{ label: 'AND', icon: IconAND, n_inputs: 2, category: 'Gate', active: data.active }}
	{selected}
/>
