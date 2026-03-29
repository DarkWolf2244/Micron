<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import IconXOR from '~icons/tabler/logic-xor';

	import type { Component } from 'svelte';

	let { selected }: { selected: boolean } = $props();
</script>

<div
	class="flex flex-row rounded-lg bg-background p-2 outline {selected
		? ' outline-primary'
		: 'outline-transparent'} transition-all"
>
	<div class="flex flex-col items-center justify-center p-1">
		<p class="p">XOR</p>
	</div>
	<div class="flex flex-col items-center justify-center p-1">
		<IconXOR color="var(--primary)"></IconXOR>
	</div>
</div>
<Handle type="source" position={Position.Right} id="handle-right" />
<Handle type="target" position={Position.Left} id="handle-left" />
