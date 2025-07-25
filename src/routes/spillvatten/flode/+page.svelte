<script>
	import { smartRound } from '$lib/utils/smartRound';
	import { slide } from 'svelte/transition';

	// -- We load layout-relevant modules here ---

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toast } from 'svelte-sonner';

	import { Toilet, Settings, X, Copy } from '@lucide/svelte';
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
	let calculationType = $state('zones'); // Standardvärde för beräkningstyp

	const triggerContent = $derived(
		frequencyFactors.find((f) => f.value.toString() === frequencyFactor.toString())?.label ??
			'Välj frekvens...'
	);

	// Skapa en Map för snabb åtkomst till sewageItem-data via id.
	// Använd $derived för att göra den reaktiv. Den uppdateras om sewageItems ändras.
	let sewageItemMap = $derived(new Map(sewageItems.map((item) => [item.id, item])));

	let zones = $state([
		{
			id: 0,
			name: 'Generell',
			open: false,
			// Starta med ett tomt objekt. Värden läggs till reaktivt vid inmatning.
			utilities: {}
		}
	]);

	function addZone() {
		const newId = zones.length > 0 ? Math.max(...zones.map((z) => z.id)) + 1 : 1;
		zones.push({
			id: newId,
			name: `Zon ${newId}`,
			open: false,
			utilities: {}
		});
		toast.success(`Zon ${newId} tillagd`);
	}

	function copyZone(zone) {
		const newId = zones.length > 0 ? Math.max(...zones.map((z) => z.id)) + 1 : 1;
		const newZone = {
			id: newId,
			name: `Zon ${newId}`,
			open: false,
			utilities: { ...zone.utilities }
		};
		zones.push(newZone);
		toast.success(`Zon ${newId} duplicerad från ${zone.name}`);
	}

	function deleteZone(zone) {
		zone.open = false; // Stäng zonen innan borttagning
		zones = zones.filter((z) => z.id !== zone.id);
		toast.success(`${zone.name} borttagen`);
	}

	function totalFlow(utilities) {
		let total = 0;
		for (const [utilityId, count] of Object.entries(utilities)) {
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

	let totalZoneFlow = $derived(zones.reduce((total, zone) => total + totalFlow(zone.utilities), 0));
	let totalZoneProbableFlow = $derived(totalZoneFlow ** 0.5 * frequencyFactor);
</script>

<div
	class="grid md:grid-cols-[16fr_16fr] grid-rows-1 divide-dashed md:divide-x-1 md:divide-y-0 divide-y-1 md:border-b-1 border-dashed"
>
	<div class="p-4">
		<Tabs.Root bind:value={calculationType}>
			<Tabs.List>
				<Tabs.Trigger value="zones">Beräkna zoner</Tabs.Trigger>
				<Tabs.Trigger value="flow">Beräkna flöde</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>

		{#if calculationType === 'zones'}
			<h1 class="mt-2">Inställningar för enheter</h1>
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
						class="ml-2 text-sm shadow-none"
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
							<Select.Item value={factor.value.toString()} label={factor.label}>
								{factor.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<div class="grid grid-cols-[120px_1fr] gap-y-0 mt-2 p-1 w-full border-1 rounded-md">
				<p class="m-1">Totalt flöde:</p>
				<p class="m-1 font-semibold">{smartRound(totalZoneFlow, 3)} l/s</p>
				<p class="m-1">Sannolikt flöde:</p>
				<p class="m-1 font-semibold">{smartRound(totalZoneProbableFlow, 3)} l/s</p>
			</div>
		{/if}
	</div>
	{#if calculationType === 'zones'}
		<div class="p-4">
			<h2 class="mb-2">Zoner</h2>
			{#each zones as zone (zone)}
				<div
					role="button"
					tabindex="0"
					transition:slide
					class="relative border-1 p-4 rounded-xl mb-4 hover:border-primary cursor-pointer z-5"
					onclick={() => (zone.open = true)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							zone.open = true;
						}
					}}
				>
					<button
						onclick={(event) => {
							deleteZone(zone);
							event.stopPropagation();
						}}
						class="absolute top-[10px] right-[10px] z-10"
					>
						<div
							class="border-1 border-background rounded-md hover:border-input p-1 cursor-pointer"
						>
							<X size={16} />
						</div>
					</button>
					<button
						onclick={(event) => {
							copyZone(zone);
							event.stopPropagation();
						}}
						class="absolute top-[10px] right-[38px] z-10"
					>
						<div
							class="border-1 border-background rounded-md hover:border-input p-1 cursor-pointer"
						>
							<Copy size={16} />
						</div>
					</button>
					<h2 class="text-center">{zone.name}</h2>
					<Dialog.Root bind:open={zone.open}>
						<Dialog.Content class="w-fit">
							<Dialog.Header>
								<Dialog.Title class="text-center"
									><input
										type="text"
										class="text-center border-0"
										bind:value={zone.name}
									/></Dialog.Title
								>
								<Dialog.Description class="text-center">Ändra antal enheter.</Dialog.Description>
							</Dialog.Header>
							{#snippet editUtilities(item, zone, utilityId)}
								{#if item}
									<div class="justify-center bg-card border-1 p-1 rounded-md">
										<item.icon size={24} />
									</div>
									{item.label}:
									<Input
										type="number"
										bind:value={zone.utilities[item.id]}
										min={0}
										step={1}
										class="ml-2 shadow-none m-0"
									/>
								{/if}
							{/snippet}
							<div class="grid grid-cols-[34px_120px_80px] gap-x-4 gap-y-2 text-sm items-center">
								{#each sewageItems as item}
									{@render editUtilities(item, zone, item.id)}
								{/each}
							</div>
							<Separator />
							<div class="grid grid-cols-2 gap-x-2 text-sm items-center">
								<p class="text-right">Normflöde</p>
								<p class=" font-semibold">{totalFlow(zone.utilities)} l/s</p>
								<p class="text-right">Sannolikt flöde</p>
								<p class=" font-semibold">{probableFlow(zone.utilities)} l/s</p>
							</div>
							<Button onclick={() => (zone.open = false)}>Stäng</Button>
						</Dialog.Content>
					</Dialog.Root>

					{#snippet utilityItem(item, zone, utilityId)}
						{#if item}
							<div
								class="flex flex-col justify-center border-1 rounded-md items-center h-fit relative"
							>
								<div class="justify-center bg-card inline-flex p-1 rounded-md w-full">
									<item.icon size={24} />
								</div>
								{#if zone.utilities[item.id]}
									<div
										class="absolute flex justify-center items-center border-primary -right-[6px] rounded-full -bottom-[6px] border-1 bg-card text-xs w-[18px] h-[18px]"
									>
										{zone.utilities[item.id]}
									</div>
								{/if}
							</div>
						{/if}
					{/snippet}

					<div class="flex flex-wrap gap-x-2 gap-y-2 mt-2 justify-center">
						{#each sewageItems as item}
							{@render utilityItem(item, zone, item.id)}
						{/each}
					</div>
					<div class="grid grid-cols-[1fr_1fr] gap-x-2 gap-y-1 mt-4 text-sm items-center">
						<span class="text-right">Normflöde</span>
						<span class=" font-semibold">{totalFlow(zone.utilities)} l/s</span>
						<span class="text-right">Sannolikt flöde</span>
						<span class=" font-semibold">{probableFlow(zone.utilities)} l/s</span>
					</div>
				</div>
			{/each}
			<Button class="w-full" onclick={addZone}>Lägg till zon</Button>
		</div>
	{/if}
</div>
