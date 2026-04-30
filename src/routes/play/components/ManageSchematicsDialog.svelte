<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';

	import IconAdd from '~icons/tabler/plus';
	import IconChoose from '~icons/tabler/arrow-right';
	import IconDelete from '~icons/tabler/trash';

	import { gameDataStore } from '$lib/data/game.svelte';
	import { toast } from 'svelte-sonner';

	let { modalManageSchematicsOpen = $bindable() }: { modalManageSchematicsOpen: boolean } =
		$props();

	let modalManageSchematicsTitleValue = $state('');
	let modalConfirmDeleteOpen = $state(false);
	let _schematicToDelete = $state('');

	let normalizedNewSchematicTitle = $derived(modalManageSchematicsTitleValue.trim());
	let hasExactTitleMatch = $derived(
		gameDataStore.data?.schematics.some(
			(s) => s.title.trim().toLowerCase() == normalizedNewSchematicTitle.toLowerCase()
		) ?? false
	);
	let canAddSchematic = $derived(Boolean(normalizedNewSchematicTitle) && !hasExactTitleMatch);

	let schematicsToShow = $derived(
		gameDataStore.data?.schematics
			.filter((p) =>
				p.title.toLowerCase().startsWith(modalManageSchematicsTitleValue.toLowerCase())
			)
			.sort(
				(a, b) =>
					(a.id == gameDataStore.data?.activeSchematicID ? 1 : 0) -
					(b.id == gameDataStore.data?.activeSchematicID ? 1 : 0)
			)
	);

	function addSchematic() {
		let data = gameDataStore.data;
		if (!data) return;

		const title = normalizedNewSchematicTitle;
		if (!title) return;

		if (hasExactTitleMatch) {
			toast.error('A schematic with that name already exists.');
			return;
		}

		const id = crypto.randomUUID();

		data.schematics.push({
			id: id,
			title: title,
			nodes: [],
			edges: []
		});
		data.activeSchematicID = id;

		modalManageSchematicsTitleValue = '';
	}

	function swapSchematic(schematicID: string) {
		let data = gameDataStore.data;
		if (!data) return;

		data.activeSchematicID = schematicID;
		modalManageSchematicsOpen = false;
	}

	function deleteSchematic(schematicID: string) {
		modalConfirmDeleteOpen = true;
		_schematicToDelete = schematicID;
	}

	function confirmDeleteSchematic() {
		modalConfirmDeleteOpen = false;
		let data = gameDataStore.data;
		if (!data) return;

		data.schematics = data.schematics.filter((s) => s.id != _schematicToDelete);
		toast.success('Schematic deleted successfully.', {
			icon: IconDelete,
			duration: 2000
		});
	}
</script>

<Dialog.Root bind:open={modalManageSchematicsOpen}>
	<Dialog.Content class="min-w-[80%]!">
		<Dialog.Header>
			<Dialog.Title class="mb-4"><h2 class="h2">Manage Schematics</h2></Dialog.Title>
		</Dialog.Header>
		<div class="flex w-full flex-row gap-4">
			<Input
				bind:value={modalManageSchematicsTitleValue}
				placeholder="Search for a schematic or create a new one..."
			/>
			<Button disabled={!canAddSchematic} onclick={addSchematic}
				><IconAdd /> New schematic</Button
			>
		</div>
		<p class="text-primary">
			Showing {schematicsToShow?.length} schematic{schematicsToShow?.length == 1 ? '' : 's'}.
		</p>
		<div class="flex flex-col gap-y-2">
			{#each schematicsToShow as schematic}
				<div
					class="flex flex-row items-center justify-between rounded-lg border border-muted p-2 {schematic.id ==
					gameDataStore.data?.activeSchematicID
						? 'bg-muted-background'
						: 'bg-card'}"
				>
					<flex class="flex-col">
						{#if schematic.id == gameDataStore.data?.activeSchematicID}
							<p class="h4 text-muted">{schematic.title}</p>
							<p class="text-muted">Active schematic</p>
						{:else}
							<p class="h4">{schematic.title}</p>
						{/if}
					</flex>
					<div class="flex flex-row items-center justify-center gap-x-2">
						<Button
							variant="outline"
							onclick={() => deleteSchematic(schematic.id)}
							disabled={schematic.id == gameDataStore.data?.activeSchematicID}
						>
							<IconDelete />
						</Button>
						<Button
							onclick={() => swapSchematic(schematic.id)}
							disabled={schematic.id == gameDataStore.data?.activeSchematicID}
							><IconChoose /></Button
						>
					</div>
				</div>
			{:else}
				<p>
					No schematics found with that name. Try creating a new one, or trying a different name.
				</p>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={modalConfirmDeleteOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you sure?</Dialog.Title>
			<Dialog.Description>You cannot un-delete a schematic.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button class="bg-red-500 hover:bg-red-400" onclick={confirmDeleteSchematic}>Confirm</Button>
			<Dialog.Close>
				<Button variant="outline">No, cancel</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
