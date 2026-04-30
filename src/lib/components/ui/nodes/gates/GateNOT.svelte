<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconNOT from '~icons/tabler/logic-not';

	let { selected, data }: { selected: boolean; data: { active: boolean } } = $props();
</script>

<GenericNode
	data={{ label: 'NOT', icon: IconNOT, n_inputs: 1, category: 'Gate', active: data.active }}
	{selected}
/>
