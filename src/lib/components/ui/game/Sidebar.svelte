<script lang="ts">
	import IconInfo from '~icons/tabler/help';
	import IconTest from '~icons/tabler/test-pipe';
	import IconCollapse from '~icons/tabler/layout-sidebar-right-collapse';

	import Button from '$lib/components/ui/button/button.svelte';
	import { fade, fly } from 'svelte/transition';
	import { gameDataStore } from '$lib/data/game.svelte';
	import { nodeInfo } from '$lib/data/info.svelte';
	import { Input } from '../input';

	let { isExpanded }: { isExpanded: boolean } = $props();

	let page = $state('info');

	function onSelect(id: string) {
		if (page == id) {
			isExpanded = !isExpanded;
		} else {
			page = id;
			isExpanded = true;
		}
	}

	let data = $derived({
		currentSelected: gameDataStore.data?.schematics
			.find((s) => s.id == gameDataStore.data?.activeSchematicID)
			?.nodes.find((n) => n.selected)
	});

	let currentNodeName = $derived(data.currentSelected?.type?.split('.').at(-1));
	let currentNodeInfo = $derived(currentNodeName ? nodeInfo[currentNodeName] : undefined);
</script>

<div class="absolute top-0 right-0 z-50 flex h-full w-[30%] grow flex-row-reverse items-center">
	<div
		class="absolute top-0 right-0 flex h-full w-fit flex-col items-center gap-2 border-l border-border bg-background p-1"
	>
		<Button variant="outline" onclick={() => onSelect('info')}><IconInfo /></Button>
		<Button variant="outline" onclick={() => onSelect('test')}><IconTest /></Button>
		<div class="h-full w-full flex-1"></div>
		{#if isExpanded}
			<Button variant="outline" onclick={() => (isExpanded = false)}><IconCollapse /></Button>
		{/if}
	</div>
	<div
		class="bg-background {isExpanded
			? 'mr-10 w-[100%]'
			: 'w-[0%]'} anchor h-full border border-border p-2 transition-all"
	>
		{#if isExpanded}
			<div in:fade={{ duration: 300 }} class="flex flex-col gap-4 overflow-y-auto p-2">
				{#if page == 'info'}
					<div class="w-fit rounded-2xl border border-border bg-background p-2 text-sm">
						{data.currentSelected?.type?.split('.').at(0)}
					</div>
					<h2 class="h1">
						{data.currentSelected?.type?.split('.').at(-1) || 'No node selected'}
					</h2>
					{#if data.currentSelected}
						<hr class="mb-2" />
						<div class="border-l-2 border-primary pl-2">
							<h3 class="h3">Description</h3>
						</div>
						<p>{currentNodeInfo?.description || 'No node selected.'}</p>
						{#if currentNodeInfo?.truthTable}
							<div class="my-2 border-l-2 border-primary pl-2">
								<h3 class="h3">Truth table</h3>
							</div>
							<table class="border border-border p-2">
								<thead class="">
									<tr>
										{#each currentNodeInfo.truthTable[0][0] as _, i}
											<th scope="col" class="border border-border p-2">Input {i}</th>
										{/each}
										{#each currentNodeInfo.truthTable[0][1] as _, i}
											<th scope="col" class="border border-border p-2">Output {i}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each currentNodeInfo.truthTable as row}
										<tr>
											{#each row[0] as input}
												<th
													scope="col"
													class="border-x border-border {row[1].length == 1
														? row[1][0] == 0
															? ''
															: 'text-primary'
														: ''}"
												>
													{input}
												</th>
											{/each}
											{#each row[1] as input}
												<th
													scope="col"
													class="border-x border-border {row[1].length == 1
														? row[1][0] == 0
															? ''
															: 'text-primary'
														: ''}"
												>
													{input}
												</th>
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						{/if}
						<div class="border-l-2 border-primary pl-2">
							<h3 class="h3">Data</h3>
						</div>

						<div class="flex w-full flex-col gap-2">
							<p>ID</p>
							<Input value={data.currentSelected?.id} disabled />
						</div>
						<div class="flex w-full flex-col gap-2">
							<p>Active</p>
							<Input value={data.currentSelected?.data.active ? 'Yes' : 'No'} disabled />
						</div>
					{/if}
				{:else if page == 'test'}
					<h2 class="h2">Test Schematic</h2>
				{/if}
			</div>
		{/if}
	</div>
</div>
