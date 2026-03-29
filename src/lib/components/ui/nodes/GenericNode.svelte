<script lang="ts">
	import { Handle, Position } from '@xyflow/svelte';
	import type { Component } from 'svelte';

	let { data, selected }: { data: { label: string; icon: Component }; selected: boolean } =
		$props();

	let Icon = $derived(data.icon);
</script>

<div
	class="flex flex-row rounded-lg bg-background p-2 outline {selected
		? ' outline-primary'
		: 'outline-transparent'} transition-all"
>
	<div class="flex flex-col items-center justify-center p-2">
		<p class="p">{data.label}</p>
	</div>
	<div class="flex flex-col items-center justify-center p-2">
		<Icon></Icon>
	</div>
</div>
<Handle type="source" position={Position.Right} id="handle-right" />
<Handle type="target" position={Position.Left} id="handle-left" />
