<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import IconNOT from '~icons/tabler/logic-not';

	import type { Component } from 'svelte';

	let { selected }: { selected: boolean } = $props();
</script>

<div
	class="flex flex-row rounded-lg bg-background p-2 outline {selected
		? ' outline-primary'
		: 'outline-transparent'} transition-all"
>
	<div class="flex flex-col items-center justify-center p-1">
		<p class="p">NOT</p>
	</div>
	<div class="flex flex-col items-center justify-center p-1">
		<IconNOT color="var(--primary)"></IconNOT>
	</div>
</div>
<Handle type="source" position={Position.Right} id="handle-right" />
<Handle type="target" position={Position.Left} id="handle-left" />
