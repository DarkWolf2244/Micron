<script lang="ts">
	import GenericNode from '../GenericNode.svelte';

	let { selected }: { selected: boolean } = $props();
</script>

<GenericNode data={{ label: 'PMOS', n_inputs: 2, category: "Transistor" }} {selected} />
