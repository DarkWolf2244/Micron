<script lang="ts">
	import GenericNode from '../GenericNode.svelte';
	import IconXOR from '~icons/tabler/logic-xor';

	let { selected }: { selected: boolean } = $props();
</script>

<GenericNode data={{ label: 'XOR', icon: IconXOR, n_inputs: 2, category: "Gate" }} {selected} />
