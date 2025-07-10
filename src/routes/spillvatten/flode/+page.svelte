<script>
	import { smartRound } from '$lib/utils/smartRound';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';

	// -- We load layout-relevant modules here ---

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	import { Toilet } from '@lucide/svelte';
	import Washbasin from '$lib/icons/washbasin.svelte';
	import Sink from '$lib/icons/sink.svelte';
	import UtilitySink from '$lib/icons/utility-sink.svelte';
	import UtilitySinkBig from '$lib/icons/utility-sink-big.svelte';
	import FloorDrain from '$lib/icons/floor-drain.svelte';

	let sewageItems = $state([
		{ id: 'washbasin', label: 'Tvättställ', icon: Washbasin, flow: 0.3 },
		{ id: 'toilet', label: 'Vattenklosett', icon: Toilet, flow: 1.8 },
		{ id: 'sink', label: 'Diskbänk', icon: Sink, flow: 0.6 },
		{ id: 'utilitySink', label: 'Utslagsback', icon: UtilitySink, flow: 0.9 },
		{ id: 'utilitySinkBig', label: 'Stor utslagsback', icon: UtilitySinkBig, flow: 1.2 },
		{ id: 'floorDrain', label: 'Golvbrunn', icon: FloorDrain, flow: 1.5 }
	]);

	const frequencyFactors = [
		{ value: 0.5, label: 'Intermittent drift' },
		{ value: 0.7, label: 'Frekvent drift' },
		{ value: 1, label: 'Kontinuerlig drift' },
		{ value: 1.2, label: 'Speciell drift' }
	];

	let frequencyFactor = $state(1); // Standardvärde för frekvensfaktor

	const triggerContent = $derived(
		frequencyFactors.find((f) => f.value === frequencyFactor)?.label ?? 'Välj frekvens...'
	);

	// Skapa en Map för snabb åtkomst till sewageItem-data via id.
	// Använd $derived för att göra den reaktiv. Den uppdateras om sewageItems ändras.
	let sewageItemMap = $derived(new Map(sewageItems.map((item) => [item.id, item])));

	let zones = $state([
		{
			id: 0,
			name: 'Generell',
			// Starta med ett tomt objekt. Värden läggs till reaktivt vid inmatning.
			utilities: {}
		}
	]);

	function addZone() {
		const newId = zones.length > 0 ? Math.max(...zones.map((z) => z.id)) + 1 : 1;
		zones.push({
			id: newId,
			name: `Zon ${newId}`,
			utilities: {}
		});
	}

	function totalFlow(utilites) {
		let total = 0;
		for (const [utilityId, count] of Object.entries(utilites)) {
			const item = sewageItemMap.get(utilityId);
			if (item) {
				total += item.flow * count;
			}
		}
		return smartRound(total, 3);
	}

	function probableFlow(utilites) {
		let total = 0;
		for (const [utilityId, count] of Object.entries(utilites)) {
			const item = sewageItemMap.get(utilityId);
			if (item) {
				total += item.flow * count;
			}
		}
		total = total ** 0.5 * frequencyFactor;
		return smartRound(total, 3);
	}
</script>

<div
	class="grid md:grid-cols-[16fr_16fr] grid-rows-1 divide-dashed md:divide-x-1 md:divide-y-0 divide-y-1 md:border-b-1 border-dashed"
>
	<div class="p-4">
		<h1>Inställningar för enheter</h1>
		<hr />
		<h2>Spillvattenarmaturer</h2>
		<div class="my-4 grid grid-cols-[34px_80px_60px_1fr] gap-4">
			{#snippet sewageItem(item)}
				<div class="border-1 bg-card shadow-2x inline-flex p-1 rounded-md h-fit">
					<item.icon size={24} />
				</div>
				<Label>{item.label}</Label>
				<Input
					type="number"
					bind:value={item.flow}
					min={0}
					max={10}
					step={0.1}
					class="ml-2 shadow-none"
				/>
				<Label>l/s</Label>
			{/snippet}

			{#each sewageItems as item}
				{@render sewageItem(item)}
			{/each}
		</div>
		<hr />
		<Select.Root type="single" name="frequencyFactor" bind:value={frequencyFactor}>
			<Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Frekvensfaktor</Select.Label>
					{#each frequencyFactors as factor (factor.value)}
						<Select.Item value={factor.value} label={factor.label}>
							{factor.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		{frequencyFactor}
	</div>
	<div class="p-4">
		<h2>Zoner</h2>
		{#each zones as zone (zone)}
			<div transition:slide animate:flip class="border-1 p-4 rounded-xl relative mt-6 mb-4">
				<input
					class="left-4 -top-4 border-1 rounded-md bg-background w-fit px-2 py-0.5 text-sm font-medium"
					bind:value={zone.name}
				/>

				{#snippet utilityItem(item, zone, utilityId)}
					{#if item}
						<div class="flex flex-col border-1 rounded-md items-center w-[40px]">
							<div
								class="justify-center bg-card shadow-inner-sm inline-flex p-1 rounded-t-md w-full relative"
							>
								<item.icon size={24} />
							</div>
							<input
								type="number"
								class="w-full text-center z-20 text-sm border-t-1 rounded-b-md rounded-t-none shadow-none h-8 p-0 no-spinner"
								min={0}
								placeholder=""
								bind:value={zone.utilities[utilityId]}
							/>
						</div>
					{/if}
				{/snippet}

				<div class="flex flex-wrap gap-x-2 gap-y-2 mt-4">
					{#each sewageItems as item}
						{@render utilityItem(item, zone, item.id)}
					{/each}
				</div>
				<Label class="mt-4">Normflöde {totalFlow(zone.utilities)} l/s</Label>
				<Label class="mt-4">Sannolikt flöde {probableFlow(zone.utilities)} l/s</Label>
			</div>
		{/each}
	</div>
	<button class="bg-primary text-primary-foreground rounded-md p-2 mt-4" onclick={addZone}>
		Lägg till zon
	</button>
</div>
