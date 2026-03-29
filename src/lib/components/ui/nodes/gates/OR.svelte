<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import IconOR from '~icons/tabler/logic-or';

	import type { Component } from 'svelte';

	let { selected }: { selected: boolean } = $props();
</script>

<div
	class="flex flex-row rounded-lg bg-background p-2 outline {selected
		? ' outline-primary'
		: 'outline-transparent'} transition-all"
>
	<div class="flex flex-col items-center justify-center p-1">
		<p class="p">OR</p>
	</div>
	<div class="flex flex-col items-center justify-center p-1">
		<IconOR color="var(--primary)"></IconOR>
	</div>
</div>
<Handle type="source" position={Position.Right} id="handle-right" />
<Handle type="target" position={Position.Left} id="handle-left" />
