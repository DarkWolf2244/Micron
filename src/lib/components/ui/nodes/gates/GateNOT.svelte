<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconNOT from '~icons/tabler/logic-not';

	let { selected }: { selected: boolean } = $props();
</script>

<GenericNode data={{ label: 'NOT', icon: IconNOT, n_inputs: 1, category: "Gate" }} {selected} />
