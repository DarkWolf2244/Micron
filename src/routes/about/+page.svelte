<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import IconExternal from '~icons/tabler/external-link';
	import IconBack from '~icons/tabler/arrow-back';

	onMount(() => {
		gsap.from('.animate-in', {
			y: -25,
			opacity: 0,
			ease: 'back.out',
			stagger: 0.05,
			duration: 0.5
		});
	});
</script>

<div
	class="flex min-h-screen w-full flex-auto flex-col items-center justify-start gap-y-8 bg-background p-4"
>
	<div class="animate-in relative flex w-full flex-row justify-center p-2">
		<h1 class="h1 font-normal tracking-widest text-primary">MICRON</h1>
		<Button href="/" class="absolute left-0 m-2"><IconBack /></Button>
	</div>
	<hr class="animate-in w-full" />
	<div class="animate-in w-full rounded-lg bg-card p-4">
		<h2 class="h2 animate-in text-center">What is this?</h2>
		<p class="p animate-in">
			Micron is a game where you learn to build logical circuits like AND gates and SR latches, and
			each circuit you build becomes a module you can use later. Eventually, you learn to build much
			more complex things, right up to simple CPUs.
		</p>
	</div>
	<div
		class="animate-in flex w-full flex-col justify-center gap-4 rounded-lg border-b border-primary bg-card p-4"
	>
		<div>
			<h3 class="animate-in h3">
				<span class="mr-4 font-bold whitespace-pre text-primary">1. </span>Build it.
			</h3>
			<p class="p animate-in">
				Build a circuit. This can be something like an XOR gate — built from the most basic
				components available, like a transistor.
			</p>
		</div>
	</div>
	<div
		class="animate-in flex w-full flex-col justify-center gap-4 rounded-lg border-b border-primary bg-card p-4"
	>
		<div>
			<h3 class="animate-in h3">
				<span class="mr-4 font-bold whitespace-pre text-primary">2.</span> Test it.
			</h3>
			<p class="p animate-in">
				Does your circuit match the specification? There's a required truth table, a map from inputs
				to their expected outputs. If your circuit matches it, the circuit is saved in your
				catalogue.
			</p>
		</div>
	</div>
	<div
		class="animate-in flex w-full flex-col justify-center gap-4 rounded-lg border-b border-primary bg-card p-4"
	>
		<div>
			<h3 class="animate-in h3">
				<span class="mr-4 font-bold whitespace-pre text-primary">3.</span> Use it.
			</h3>
			<p class="p animate-in">
				Re-use circuits you made before in newer designs. If you built an XOR gate, you can use it
				in a brand new half-bit adder.
			</p>
		</div>
	</div>
	<div
		class="animate-in flex w-full flex-col justify-center gap-4 rounded-lg border-b border-primary bg-card p-4"
	>
		<div>
			<h3 class="animate-in h3">
				<span class="mr-4 font-bold whitespace-pre text-primary">4.</span> Repeat.
			</h3>
			<p class="p animate-in">
				You finished making the half-bit adder? Great, now make a full-bit adder. Made a full-bit
				adder? Make an Arithmetic Logic Unit from that (among many things). Build bigger, more
				complex things based on things you made before.
			</p>
		</div>
	</div>
	<div class="animate-in w-full rounded-lg bg-card p-4">
		<h2 class="h2 animate-in text-center">But I'm not an electronics major.</h2>
		<p class="p animate-in">
			Neither am I. This game is very basic. Everything you need to know is taught to you quickly,
			and the complex stuff is just not in the game.
		</p>
	</div>
	<div class="animate-in w-full rounded-lg bg-card p-4">
		<h2 class="h2 animate-in text-center">Why/how was this made?</h2>
		<p class="p animate-in">
			This was made for
			<a href="https://flavortown.hackclub.com" class="text-primary underline" target="_blank"
				>Flavortown <IconExternal class="inline size-3" /></a
			>, a Hack Club event, with <span class="text-primary">SvelteKit</span>,
			<span class="text-primary">shadcn/ui</span>, and
			<span class="text-primary">Svelte Flow</span>. I used
			<a href="https://canva.com" class="text-primary underline" target="_blank"
				>Canva <IconExternal class="inline size-3" /></a
			>
			for some of the shoddy graphics.
			<a href="https://gsap.com" class="text-primary underline" target="_blank"
				>GSAP <IconExternal class="inline size-3" /></a
			> was used for the animations.
		</p>
	</div>
</div>
