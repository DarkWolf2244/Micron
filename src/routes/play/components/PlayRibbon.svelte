<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { gameDataStore } from '$lib/data/game.svelte';
	import IconEdit from '~icons/tabler/edit';
	import IconCheckmark from '~icons/tabler/check';
	import IconManage from '~icons/tabler/folder';
	import IconAdd from '~icons/tabler/plus';

	import * as Dialog from '$lib/components/ui/dialog/index';
	import { Input } from '$lib/components/ui/input';
	import { fade } from 'svelte/transition';
	import { Card } from '$lib/components/ui/card';
	import ManageSchematicsDialog from './ManageSchematicsDialog.svelte';

	let { onModalAddNodeMenuLaunch }: { onModalAddNodeMenuLaunch: () => void } = $props();

	let activeSchematic = $derived(
		gameDataStore.data?.schematics.find((s) => s.id == gameDataStore.data?.activeSchematicID)
	);

	let modalEditSchematicNameValue = $state('');
	let modalEditSchematicNameOpen = $state(false);
	let modalManageSchematicsOpen = $state(false);

	function modalEditSchematicNameSubmit() {
		if (!activeSchematic) return;

		const name = modalEditSchematicNameValue;
		activeSchematic.title = name;
		modalEditSchematicNameOpen = false;
		console.log(modalEditSchematicNameOpen);
	}
	function modalEditSchematicNameLaunch() {
		modalEditSchematicNameValue = activeSchematic?.title || '';
		modalEditSchematicNameOpen = true;
	}
	function modalManageSchematicsLaunch() {
		modalManageSchematicsOpen = true;
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
	<div class="inset-zero absolute flex h-full w-full flex-row items-center justify-end gap-x-4 p-2">
		<div
			class="flex flex-row items-center justify-center gap-4 rounded-lg border-b border-primary bg-card p-2"
		>
			<Button variant="outline" onclick={modalEditSchematicNameLaunch}><IconEdit></IconEdit></Button
			>
			<Button variant="outline" onclick={modalManageSchematicsLaunch}
				><IconManage></IconManage></Button
			>
		</div>
		<div
			class="flex flex-row items-center justify-center gap-4 rounded-lg border-b border-primary bg-card p-2"
		>
			<Button variant="outline" onclick={onModalAddNodeMenuLaunch}><IconAdd></IconAdd></Button>
		</div>
	</div>
</div>

<Dialog.Root bind:open={modalEditSchematicNameOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="">Enter a new name for this schematic.</Dialog.Title>
			<Dialog.Description></Dialog.Description>
		</Dialog.Header>
		<div class="flex flex-row gap-2">
			<Input
				bind:value={modalEditSchematicNameValue}
				placeholder="Untitled schematic"
				class="text-foreground"
				onkeydown={(event) => event.key == 'Enter' && modalEditSchematicNameSubmit()}
			></Input>
			<div>
				<Button onclick={modalEditSchematicNameSubmit} disabled={!modalEditSchematicNameValue}
					><IconCheckmark /></Button
				>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

<ManageSchematicsDialog bind:modalManageSchematicsOpen />
