<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import IconAND from '~icons/tabler/logic-and';

	import type { Component } from 'svelte';

	let { selected }: { selected: boolean } = $props();
</script>

<div
	class="flex flex-row rounded-lg bg-background p-2 outline {selected
		? ' outline-primary'
		: 'outline-transparent'} transition-all"
>
	<div class="flex flex-col items-center justify-center p-1">
		<p class="p">AND</p>
	</div>
	<div class="flex flex-col items-center justify-center p-1">
		<IconAND color="var(--primary)"></IconAND>
	</div>
</div>
<Handle type="source" position={Position.Right} id="handle-right" />
<Handle type="target" position={Position.Left} id="handle-left" />
