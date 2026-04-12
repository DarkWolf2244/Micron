<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { gameDataStore } from '$lib/data/game.svelte';
	import IconEdit from '~icons/tabler/edit';
	import IconCheckmark from '~icons/tabler/check';

	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Input } from '$lib/components/ui/input';
	import { fade } from 'svelte/transition';

	let activeSchematic = $derived(
		gameDataStore.data?.schematics.find((s) => s.id == gameDataStore.data?.activeSchematicID)
	);

	let modalEditSchematicNameValue = $state('');
	let modalEditSchematicNameOpen = $state(false);

	function modalEditSchematicNameSubmit() {
		if (!activeSchematic) return;

		const name = modalEditSchematicNameValue;
		activeSchematic.title = name;
		modalEditSchematicNameOpen = false;
	}
	function modalEditSchematicNameLaunch() {
		modalEditSchematicNameValue = activeSchematic?.title || '';
		modalEditSchematicNameOpen = true;
	}
</script>

<div
	class="relative flex w-full flex-row items-center justify-center border-b border-border bg-background p-2"
>
	<div class=" flex h-full w-full flex-row items-center justify-center">
		<h1>
			<span class="h1 font-normal tracking-widest text-primary">MICRON</span>
			<span class="h1 mx-2 font-normal text-primary">/</span>
			<span class="h1 font-light text-muted-foreground">{activeSchematic?.title}</span>
		</h1>
	</div>
	<div class="inset-zero absolute flex h-full w-full flex-row items-center justify-end p-2">
		<div class="flex flex-row items-center justify-center gap-4 rounded-lg bg-card p-2">
			<Button variant="outline" onclick={modalEditSchematicNameLaunch}><IconEdit></IconEdit></Button
			>
		</div>
	</div>
</div>

<Dialog.Root bind:open={modalEditSchematicNameOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="mb-4">Enter a new name for this schematic.</Dialog.Title>
			<Dialog.Description>
				<div class="flex flex-row gap-2">
					<Input
						bind:value={modalEditSchematicNameValue}
						placeholder="Untitled schematic"
						class="text-foreground"
					></Input>
					<div>
						<Button onclick={modalEditSchematicNameSubmit} disabled={!modalEditSchematicNameValue}
							><IconCheckmark /></Button
						>
					</div>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
