<script lang="ts">
	import GenericNode from '$lib/components/ui/nodes/GenericNode.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index';

	import type { Component } from 'svelte';

	let components: { id: string; widget: Component<any, {}, string>; props: string[] }[] = [
		{
			id: 'GenericNode',
			widget: GenericNode,
			props: ['icon', 'label']
		}
	];

	let chosenComponentID = $state('');
	let ChosenComponent = $derived(components.find((c) => c.id == chosenComponentID)?.widget);
	let chosenComponentObject = $derived(components.find((c) => c.id == chosenComponentID));
</script>

<div class="flex min-h-screen w-full flex-col items-center space-y-4 p-2">
	<h1 class="h1">Previewing components</h1>
	<p class="p">Choose a component to preview:</p>
	<Select.Root type="single" bind:value={chosenComponentID}>
		<Select.Trigger class="w-45"
			>{chosenComponentID ? chosenComponentID : 'Select a component'}</Select.Trigger
		>
		<Select.Content>
			{#each components as component}
				<Select.Item value={component.id}>{component.id}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	{#if chosenComponentID}
		{#each chosenComponentObject?.props as prop}
			<div class="flex flex-row items-center justify-between">
				<p class="p">{prop}</p>
				<Input type="text" placeholder="Email" class="max-w-xs" />
			</div>
		{/each}
	{/if}
	<div
		class="m-2 flex h-full w-full flex-1 flex-col items-center justify-center rounded-lg border border-primary p-2"
	>
		<ChosenComponent></ChosenComponent>
	</div>
</div>
