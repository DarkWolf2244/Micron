<script lang="ts">
	import IconInfo from '~icons/tabler/help';
	import IconTest from '~icons/tabler/test-pipe';
	import IconTestFail from '~icons/tabler/test-pipe-off';
	import IconTestPass from '~icons/tabler/map-check';
	import IconCollapse from '~icons/tabler/layout-sidebar-right-collapse';
	import IconCourse from '~icons/tabler/map';
	import IconCheck from '~icons/tabler/check';
	import IconLock from '~icons/tabler/lock';
	import IconProgress from '~icons/tabler/progress';
	import IconAlert from '~icons/tabler/alert-circle';
	import IconStart from '~icons/tabler/play';
	import IconSettings from '~icons/tabler/settings';

	import Button from '$lib/components/ui/button/button.svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { courseOutline, gameDataStore } from '$lib/data/game.svelte';
	import { nodeInfo } from '$lib/data/info.svelte';
	import { Input } from '../input';

	import * as Select from '$lib/components/ui/select';
	import { backIn, backOut, elasticOut, expoIn, expoOut } from 'svelte/easing';
	import { testSchematic } from '$lib/data/schematic.svelte';
	import { tick } from 'svelte';
	import type { Node } from '@xyflow/svelte';
	import gsap from 'gsap';
	import { overlayStore } from '$lib/data/overlay.svelte';
	import { tutorial } from '$lib/data/tutorial.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { isExpanded }: { isExpanded: boolean } = $props();

	let page = $state('info');

	let modalConfirmResetOpen = $state(false);

	function resetGame() {
		modalConfirmResetOpen = true;
	}
	async function confirmReset() {
		localStorage.clear();
		console.log(goto(resolve('/')));
	}
	function onSelect(id: string) {
		if (page == id) {
			isExpanded = !isExpanded;
		} else {
			page = id;
			isExpanded = true;
		}
	}

	let activeSchematic = $derived(
		gameDataStore.data?.schematics.find((s) => s.id == gameDataStore.data?.activeSchematicID)
	);
	let inputNodeOptions = $derived(
		activeSchematic?.nodes.filter((n) => n.type?.startsWith('Inputs')) ?? []
	);
	let outputNodeOptions = $derived(
		activeSchematic?.nodes.filter((n) => n.type?.startsWith('Outputs')) ?? []
	);
	let inputNodeIDs = $derived(inputNodeOptions.map((n) => n.id).join('|'));
	let outputNodeIDs = $derived(outputNodeOptions.map((n) => n.id).join('|'));

	let data = $derived({
		currentSelected: activeSchematic?.nodes.find((n) => n.selected)
	});

	let currentNodeName = $derived(data.currentSelected?.type?.split('.').at(-1));
	let currentNodeInfo = $derived(currentNodeName ? nodeInfo[currentNodeName] : undefined);
	let nextSchematicToUnlock = $derived(gameDataStore.data?.nextSchematicToUnlock);
	let unlockNodeName = $derived(nextSchematicToUnlock?.split('.').at(-1));
	let unlockNodeInfo = $derived.by(() => {
		return unlockNodeName ? nodeInfo[unlockNodeName] : undefined;
	});

	let unlockMap: { inputs: { [key: string]: string }; outputs: { [key: string]: string } } = $state(
		{ inputs: {}, outputs: {} }
	);
	let unlockVerificationState: { error?: string; success?: boolean } = $derived.by(() => {
		if (!unlockNodeInfo) {
			return {
				error: 'There are no more schematics to unlock.'
			};
		}

		const inputIDs = new Set(inputNodeOptions.map((n) => n.id));
		const outputIDs = new Set(outputNodeOptions.map((n) => n.id));
		const selectedInputs = unlockNodeInfo.inputList.map((input) => unlockMap.inputs[input]);
		const selectedOutputs = unlockNodeInfo.outputList.map((output) => unlockMap.outputs[output]);

		if (!selectedInputs.every(Boolean) || !selectedOutputs.every(Boolean)) {
			return {
				error: 'Please link all the inputs and outputs.'
			};
		}

		if (!selectedInputs.every((input) => inputIDs.has(input))) {
			return {
				error: 'One of the linked Input nodes no longer exists.'
			};
		}

		if (!selectedOutputs.every((output) => outputIDs.has(output))) {
			return {
				error: 'One of the linked Output nodes no longer exists.'
			};
		}

		if (new Set(selectedInputs).size !== selectedInputs.length) {
			return {
				error: 'Some inputs are linked to the same Input node. Please choose distinct Input nodes.'
			};
		}

		if (new Set(selectedOutputs).size !== selectedOutputs.length) {
			return {
				error:
					'Some outputs are linked to the same Output node. Please choose distinct Output nodes.'
			};
		}

		return { success: true };
	});

	let testingStatus: 'none' | 'progress' | 'fail' | 'pass' = $state('none');
	let testRows: { lists: number[][]; success: boolean }[] = $state([]);

	function getNodeTitle(node: Node) {
		const title = node.data?.title;
		return typeof title === 'string' && title.trim() ? title : node.id;
	}

	function getInputSelectionLabel(input: string) {
		const node = inputNodeOptions.find((n) => n.id == unlockMap.inputs[input]);
		return node ? getNodeTitle(node) : 'Choose an input';
	}

	function getOutputSelectionLabel(output: string) {
		const node = outputNodeOptions.find((n) => n.id == unlockMap.outputs[output]);
		return node ? getNodeTitle(node) : 'Choose an output';
	}

	async function startTest() {
		if (!unlockNodeInfo || !nextSchematicToUnlock) return;

		testingStatus = 'progress';
		testRows = [];

		let tester = testSchematic(unlockMap);

		for (let row of unlockNodeInfo.truthTable!) {
			await tick();
			let { done, value } = tester.next();
			if (value) {
				let eList = value[0] as number[];
				let rList = value[1] as number[];
				let success = value[2] as boolean;
				testRows.push({ lists: [eList, rList], success });
				console.log('Sidebar', eList, rList, success);
			}
			await new Promise<void>((resolve, reject) => {
				setTimeout(() => resolve(), 1000);
			});
		}
		testingStatus = testRows.every((row) => row.success) ? 'pass' : 'fail';
		if (testingStatus == 'pass') {
			const unlockedTag = nextSchematicToUnlock;

			overlayStore.runOnce(
				'New node unlocked!',
				"It's been added to your catalog.",
				'Continue',
				() => {
					if (!gameDataStore.data) return;

					overlayStore.close();

					unlockMap.inputs = {};
					unlockMap.outputs = {};
					testingStatus = 'none';

					tutorial.managerRef?.onUnlock(unlockedTag);
					if (!gameDataStore.data.unlockedSchematics.includes(unlockedTag)) {
						gameDataStore.data.unlockedSchematics.push(unlockedTag);
					}
					gameDataStore.data.nextSchematicToUnlock =
						courseOutline[courseOutline.indexOf(unlockedTag) + 1];
				}
			);
		}
	}

	$effect(() => {
		void inputNodeIDs;
		void outputNodeIDs;

		const inputIDs = new Set(inputNodeOptions.map((n) => n.id));
		const outputIDs = new Set(outputNodeOptions.map((n) => n.id));

		for (const key of Object.keys(unlockMap.inputs)) {
			if (unlockMap.inputs[key] && !inputIDs.has(unlockMap.inputs[key])) {
				unlockMap.inputs[key] = '';
			}
		}

		for (const key of Object.keys(unlockMap.outputs)) {
			if (unlockMap.outputs[key] && !outputIDs.has(unlockMap.outputs[key])) {
				unlockMap.outputs[key] = '';
			}
		}
	});
</script>

<div
	class="pointer-events-none absolute top-0 right-0 z-40 flex h-full grow flex-row-reverse items-center md:w-[50%] lg:w-[35%]"
>
	<div
		class="pointer-events-auto absolute top-0 right-0 flex h-full w-fit flex-col items-center gap-2 border-l border-border bg-background p-1"
	>
		<Button variant="outline" onclick={() => onSelect('info')}
			><IconInfo
				class="{page == 'info' && isExpanded ? 'text-primary' : ''} transition-colors"
			/></Button
		>
		<Button variant="outline" onclick={() => onSelect('test')}
			><IconTest
				class="{page == 'test' && isExpanded ? 'text-primary' : ''} transition-colors"
			/></Button
		>
		<Button variant="outline" onclick={() => onSelect('course')}
			><IconCourse
				class="{page == 'course' && isExpanded ? 'text-primary' : ''} transition-colors"
			/></Button
		>
		<Button variant="outline" onclick={() => onSelect('settings')}
			><IconSettings
				class="{page == 'settings' && isExpanded ? 'text-primary' : ''} transition-colors"
			/></Button
		>
		<div class="h-full w-full flex-1"></div>
		{#if isExpanded}
			<Button variant="outline" onclick={() => (isExpanded = false)}><IconCollapse /></Button>
		{/if}
	</div>
	<div
		class="bg-background {isExpanded
			? 'pointer-events-auto mr-10 w-full'
			: 'pointer-events-none w-[0%]'} anchor h-full border border-border p-2 transition-all duration-300 ease-in-out"
	>
		{#if isExpanded}
			<div in:fade={{ duration: 400 }} class="flex h-full flex-col gap-4 overflow-y-auto p-2">
				{#if page == 'info'}
					{#if data.currentSelected}
						<div class="w-fit rounded-2xl border border-border bg-background p-2 text-sm">
							{data.currentSelected?.type?.split('.').at(0)}
						</div>
					{/if}
					<h2 class="h1">
						{data.currentSelected?.type?.split('.').at(-1) || 'No node selected'}
					</h2>
					{#if data.currentSelected}
						<p class="p mt-0! text-xl font-light">
							{currentNodeInfo?.description || 'No node selected.'}
						</p>
						<hr class="mb-2" />
						{#if currentNodeInfo?.truthTable}
							<div class="border-l-2 border-primary pl-2">
								<h3 class="h3">Truth table</h3>
							</div>
							<table class="border border-border p-2">
								<thead class="">
									<tr>
										{#each currentNodeInfo.truthTable[0][0] as _, i}
											<th scope="col" class="border border-border p-2">Input {i + 1}</th>
										{/each}
										{#each currentNodeInfo.truthTable[0][1] as _, i}
											<th scope="col" class="border border-border p-2">Output {i + 1}</th>
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
					<h2 class="h1">Testing</h2>
					<hr class="mb-2" />
					{#if unlockNodeInfo && nextSchematicToUnlock}
					<div class="flex w-full flex-col items-center gap-2 rounded-xl bg-card p-4">
						<p class="h4 w-full text-start font-light">Now unlocking</p>

						<h3 class="w-full text-start text-4xl font-bold text-primary">
							{unlockNodeName}
						</h3>
					</div>

					<div class="flex h-fit w-full flex-col gap-2 rounded-xl bg-card p-4">
						<h3 class="h2">Inputs | Outputs</h3>
						<p class="p">
							Once you have Input nodes set up in your schematic, you need to map them to the
							required test titles.
						</p>
						{#each unlockNodeInfo.inputList as input}
							<div class="flex w-full flex-row justify-between gap-2 p-2">
								<p class="p">{input} ID</p>
								<Select.Root type="single" bind:value={unlockMap.inputs[input]}>
									<Select.Trigger>{getInputSelectionLabel(input)}</Select.Trigger>
									<Select.Content>
										{#each inputNodeOptions as node}
											<Select.Item value={node.id} label={getNodeTitle(node)}
												>{getNodeTitle(node)}</Select.Item
											>
										{:else}
											<Select.Item disabled value={'None'}
												>No inputs found. <br />Create a new Input node.</Select.Item
											>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>
						{/each}
						{#each unlockNodeInfo.outputList as output}
							<div class="flex w-full flex-row justify-between gap-2 p-2">
								<p class="p">{output} ID</p>
								<Select.Root type="single" bind:value={unlockMap.outputs[output]}>
									<Select.Trigger>{getOutputSelectionLabel(output)}</Select.Trigger>
									<Select.Content>
										{#each outputNodeOptions as node}
											<Select.Item value={node.id} label={getNodeTitle(node)}
												>{getNodeTitle(node)}</Select.Item
											>
										{:else}
											<Select.Item disabled value={'None'}
												>No Outputs found. <br />Create a new Output node.</Select.Item
											>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>
						{/each}
						{#if unlockVerificationState.error}
							<div
								in:fly={{ duration: 200, y: -20, easing: expoOut }}
								out:fly={{ duration: 50, y: 20, easing: expoIn }}
								class="flex w-full flex-row items-center gap-2 rounded-lg border-b border-accent bg-background p-2"
							>
								<IconAlert class="inline-block size-5 min-w-5 text-white" />
								<p class="inline-block">{unlockVerificationState.error}</p>
							</div>
						{:else}
							<div
								in:fly={{ duration: 200, y: -20, easing: expoOut }}
								out:fly={{ duration: 50, y: 20, easing: expoIn }}
								class="flex w-full flex-row items-center gap-2 rounded-lg border-b border-primary bg-background p-2"
							>
								<IconCheck class="inline-block size-5 min-w-5 text-primary" />
								<p class="inline-block">Everything looks good.</p>
							</div>
						{/if}
					</div>
					{#if unlockVerificationState.error}
						<div class="flex h-full w-full flex-col rounded-xl bg-card p-4">
							<div class="flex w-full flex-row justify-between">
								<h3 class="h2 text-muted">Run</h3>
								<Button variant="default" disabled>Start <IconStart /></Button>
							</div>
							<p class="p text-muted">Set up the inputs and outputs to run the circuit.</p>
						</div>{:else}
						<div class="flex h-full w-full flex-col gap-4 rounded-xl bg-card p-4">
							<div class="flex w-full flex-row justify-between">
								<h3 class="h2">Run</h3>
								<Button
									variant={testingStatus == 'pass' ? 'outline' : 'default'}
									onclick={startTest}
									disabled={testingStatus == 'progress'}
								>
									{#if testingStatus == 'progress'}<IconProgress class="animate-spin"
										></IconProgress>{:else}Start <IconStart />{/if}</Button
								>
							</div>
							<div
								class="flex w-full flex-row items-center gap-2 rounded-lg border-b {testingStatus ==
								'pass'
									? 'border-primary'
									: testingStatus == 'fail'
										? 'border-red-500'
										: 'border-accent'} bg-background p-2"
							>
								{#if testingStatus == 'none'}
									<IconTest class="inline-block size-8 min-w-5 text-white" />
									<p class="inline-block">You haven't run the tests yet.</p>
								{:else if testingStatus == 'progress'}
									<IconProgress class="inline-block size-8 min-w-5 animate-spin text-white" />
									<p class="inline-block">Running {unlockNodeInfo.truthTable!.length} tests...</p>
								{:else if testingStatus == 'fail'}
									<div
										class="inline-flex flex-col items-center justify-center"
										transition:fly={{ easing: backOut, x: -5, duration: 250 }}
									>
										<IconTestFail class="inline-block size-8 min-w-5 text-red-500" />
									</div>
									<p class="inline-flex flex-col items-center justify-center">
										Failed {testRows.filter((r) => !r.success).length}/{testRows.length} tests.
									</p>
								{:else if testingStatus == 'pass'}
									<div
										class="inline-flex flex-col items-center justify-center"
										transition:scale={{ easing: backOut, duration: 250 }}
									>
										<IconTestPass class="inline-block size-8 min-w-5 text-primary" />
									</div>
									<p class="inline-flex flex-col items-center justify-center">
										Passed {testRows.filter((r) => r.success).length}/{testRows.length} tests! Your schematic
										works.
									</p>
								{/if}
							</div>
							<table class="border border-border p-2">
								<thead class="">
									<tr>
										{#each unlockNodeInfo.truthTable![0][0] as _, i}
											<th scope="col" class="border border-border p-2">Input {i + 1}</th>
										{/each}
										{#each unlockNodeInfo.truthTable![0][1] as _, i}
											<th scope="col" class="border border-border p-2">Output {i + 1}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									{#each unlockNodeInfo.truthTable as row, index}
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
											{#each row[1] as output, j}
												<th scope="col" class="animate-on-pass border-x border-border">
													<span
														class={row[1].length == 1 ? (row[1][0] == 0 ? '' : 'text-primary') : ''}
													>
														{output}
													</span>
													{#if testRows[index] && testRows[index].success}
														<div
															class="inline-block"
															transition:fly={{ x: 5, duration: 300, easing: expoOut }}
														>
															<IconCheck class="inline-block text-primary" />
														</div>
													{:else if testRows[index] && !testRows[index].success}
														<div
															class="inline-block"
															transition:fly={{ x: 5, duration: 300, easing: expoOut }}
														>
															<IconAlert class="inline-block text-red-500" />
															<span>{testRows[index].lists[1][j]}</span>
														</div>
													{/if}
												</th>
											{/each}
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
					{:else}
						<div class="flex w-full flex-col gap-2 rounded-xl bg-card p-4">
							<h3 class="h2 text-primary">All schematics unlocked</h3>
							<p class="p">There are no remaining course circuits to test.</p>
						</div>
					{/if}
				{:else if page == 'course'}
					<h2 class="h1">Progress</h2>
					<hr class="mb-2" />
					<div class="flex h-full w-full flex-col gap-4 overflow-y-auto">
						{#each courseOutline as tag, i}
							{#if gameDataStore.data?.unlockedSchematics.includes(tag)}
								<div class="flex flex-row rounded-lg">
									<div class="w-full rounded-l-xl bg-primary p-2 text-primary-foreground">
										{tag.split('.').at(-1)}
									</div>
									<div class="rounded-r-xl bg-card p-2">
										<IconCheck class="text-primary" />
									</div>
								</div>
							{:else if gameDataStore.data?.unlockedSchematics.includes(courseOutline.at(i - 1)!)}
								<div class="flex flex-row rounded-lg">
									<div class="w-full animate-pulse rounded-l-xl bg-card p-2 text-card-foreground">
										{tag.split('.').at(-1)}
									</div>
									<div class="animate-pulse rounded-r-xl bg-card p-2">
										<IconProgress class="animate-spin" />
									</div>
								</div>
							{:else}
								<div class="flex flex-row rounded-lg">
									<div class="w-full rounded-l-xl bg-muted p-2 text-muted-foreground">
										{tag.split('.').at(-1)}
									</div>
									<div class="rounded-r-xl bg-muted p-2">
										<IconLock class="text-muted-foreground" />
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{:else if page == 'settings'}
					<h2 class="h1">Settings</h2>
					<hr class="mb-2" />
					<div class="flex flex-row justify-between">
						<p class="text-primary">Version</p>
						<p class="text-white">V{gameDataStore.data?.schemaVersion}</p>
					</div>
					<Button variant="destructive" onclick={resetGame}>Delete game data and reset game</Button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<Dialog.Root bind:open={modalConfirmResetOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you sure you want to reset the game?</Dialog.Title>
			<Dialog.Description>You will lose all your progress and schematics.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button class="bg-red-500 hover:bg-red-400" onclick={confirmReset}>Confirm</Button>
			<Dialog.Close>
				<Button variant="outline">No, cancel</Button>
			</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
