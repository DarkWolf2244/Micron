<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconAND from '~icons/tabler/logic-and';

	let { selected }: { selected: boolean } = $props();
</script>

<GenericNode data={{ label: 'AND', icon: IconAND, n_inputs: 2, category: "Gate" }} {selected} />
