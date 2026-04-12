<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconOR from '~icons/tabler/logic-or';

	let { selected }: { selected: boolean } = $props();
</script>

<GenericNode data={{ label: 'OR', icon: IconOR, n_inputs: 2, category: "Gate" }} {selected} />
