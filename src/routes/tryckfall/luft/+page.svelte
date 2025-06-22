<script lang="ts">
	// --- IMPORT DEFINITIONS ---
	// --- We load UI-relevant modules here ---
	import { slide, fly } from 'svelte/transition';
	import { tick } from 'svelte';

	import { getBellCurveValue } from '$lib/utils/bellCurveUtils.js';

	// -- We load layout-relevant modules here ---
	import InputLabel from '$lib/components/InputLabel.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { SliderWithLabel } from '$lib/components/ui/slider/index.js';

	import * as Table from '$lib/components/ui/table/index.js';

	import { ChevronRight } from '@lucide/svelte';

	// --- We load program related modules ---
	import CoolProp from './components/AirCoolProp.svelte'; // Import the new component
	import { airPropertiesStore } from './components/airPropertiesStore.svelte.js'; // Import the air properties store
	import { inputStore } from './components/inputStore.svelte.js'; // Import the air properties store
	import { calculatePressureDrop, colebrook } from '../components/calculations.js'; // Import the pressure drop calculation function
	import { smartRound } from '$lib/utils/smartRound.js';

	// --- We load Swedish standard ductt series, flow rate units, and power units ---
	import ductSeriesData from '../luft/components/duct.series.json';
	import flowRateSeriesData from '../luft/components/duct.flow.rate.json';
	import powerData from '../luft/components/power.json';

	// --- VARIABLE DEFINITIONS ---
	// --- Local UI states ---
	let propertiesVisible = $state(false);
	let useRectangular = $state(false);
	let flowInfinity = $derived(inputStore.inletTemperature === inputStore.outletTemperature);

	// --- State Variables ---

	// Initialize standard values
	//let flowRateSeries = $state(flowRateSeriesData[0]);
	//let powerSeries = $state(powerData[0]);
	//let ductSeries = $state(ductSeriesData[0]);
	let roughness = $derived(inputStore.ductSeries.roughness);
	//let flowRateM3s = $state(0.02); // Flow rate in m³/s
	//let powerW = $state(0); // Power in Watts
	//let flowPriority = $state(true); // Flow rate priority for calculations

	$effect(() => {
		if (inputStore.flowPriority) {
			// If flow rate is prioritized, calculate power based on flow rate
			inputStore.powerW =
				(inputStore.flowRateM3s ?? 0) *
				airPropertiesStore.airDensity *
				airPropertiesStore.specificHeatCapacity *
				(inputStore.inletTemperature - inputStore.outletTemperature);
		} else {
			// If power is prioritized, calculate flow rate based on power
			inputStore.flowRateM3s =
				(inputStore.powerW ?? 0) /
				(airPropertiesStore.airDensity *
					airPropertiesStore.specificHeatCapacity *
					(inputStore.inletTemperature - inputStore.outletTemperature));
		}
	});

	let ductArray = $derived.by(() => {
		if (!useRectangular) {
			return inputStore.ductSeries.dn.map((dnValue) => {
				var diameter = dnValue / 1000; // Convert DN to meters
				const velocity =
					Math.abs(inputStore.flowRateM3s ?? 0) / (Math.PI * Math.pow(diameter / 2, 2)); // Calculate velocity in m/s
				const hydraulicDiameter = diameter; // For circular ducts, hydraulic diameter is the same as diameter
				const reynoldsNumber =
					(velocity * hydraulicDiameter) / airPropertiesStore.kinematicViscosity; // Calculate Reynolds number
				const frictionFactor = colebrook(reynoldsNumber, roughness / (hydraulicDiameter * 1000)); // Calculate friction factor using Colebrook equation
				const pressureDrop = calculatePressureDrop(
					airPropertiesStore.dynamicViscosity,
					airPropertiesStore.airDensity,
					hydraulicDiameter,
					velocity,
					reynoldsNumber,
					frictionFactor,
					inputStore.TRANSITIONLIMIT,
					inputStore.TRANSITION_INTERVAL
				);
				return { dn: dnValue, diameter, velocity, reynoldsNumber, frictionFactor, pressureDrop };
			});
		} else {
			return inputStore.ductSeries.rect.map((rectValue) => {
				var diameter = (2 * rectValue[0] * rectValue[1]) / (rectValue[0] + rectValue[1]) / 1000; // Convert DN to meters
				const velocity =
					Math.abs(inputStore.flowRateM3s ?? 0) / ((rectValue[0] * rectValue[1]) / 1000000); // Calculate velocity in m/s
				const hydraulicDiameter = diameter; // For circular ducts, hydraulic diameter is the same as diameter
				const reynoldsNumber =
					(velocity * hydraulicDiameter) / airPropertiesStore.kinematicViscosity; // Calculate Reynolds number
				const frictionFactor = colebrook(reynoldsNumber, roughness / (hydraulicDiameter * 1000)); // Calculate friction factor using Colebrook equation
				const pressureDrop = calculatePressureDrop(
					airPropertiesStore.dynamicViscosity,
					airPropertiesStore.airDensity,
					hydraulicDiameter,
					velocity,
					reynoldsNumber,
					frictionFactor,
					inputStore.TRANSITIONLIMIT,
					inputStore.TRANSITION_INTERVAL
				);
				return {
					rect: rectValue,
					diameter,
					velocity,
					reynoldsNumber,
					frictionFactor,
					pressureDrop
				};
			});
		}
	});
</script>

<!-- Instantiate CoolProp component (renders nothing, just runs logic) -->
<CoolProp />

<div class="flex flex-col md:flex-row gap-6 items-start">
	<Card.Root class="flex w-full md:w-[290px] gap-y-0">
		<Card.Header class="pb-4">
			<Card.Title>Inställningar</Card.Title>
			<Card.Description>Ange inställningar för att beräkna tryckfall i kanaler.</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col">
			<div class="flex w-full max-w-sm flex-row gap-x-3 items-center pb-4">
				<Label for="material">Använd rektangulära kanaler?</Label>
				<Switch bind:checked={useRectangular}></Switch>
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5 pb-4">
				<Label for="material">Kanalmaterial</Label>
				<Select.Root
					type="single"
					bind:value={inputStore.ductSeries.name}
					onValueChange={(name) =>
						(inputStore.ductSeries =
							ductSeriesData.find((d) => d.name === name) ?? ductSeriesData[0])}
				>
					<Select.Trigger class="w-[220px]">{inputStore.ductSeries.name}</Select.Trigger>
					<Select.Content>
						<Select.Label>Kanalmaterial</Select.Label>
						{#each ductSeriesData as option}
							<Select.Item value={option.name} label={option.name} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-row gap-x-5">
				<div class="flex md:max-w-sm flex-col gap-1.5 pb-4">
					<Label for="supply">Tilluft</Label>
					<div class="flex flex-row items-center gap-x-2">
						<Input
							type="number"
							class="md:w-[80px]"
							id="supply"
							bind:value={inputStore.inletTemperature}
						/>
						<span>°C</span>
					</div>
				</div>

				<div class="flex md:max-w-sm flex-col gap-1.5">
					<Label for="supply">Frånluft</Label>
					<div class="flex flex-row items-center gap-x-2">
						<Input
							type="number"
							class="md:w-[80px]"
							id="return"
							bind:value={inputStore.outletTemperature}
						/>
						<span>°C</span>
					</div>
				</div>
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5 pb-4">
				<Label for="supply">Luftflöde</Label>
				<div class="flex flex-row gap-x-2">
					<Input
						type="number"
						class="w-full md:w-[120px] {!inputStore.flowPriority ? 'text-muted-foreground' : ''}"
						id="flowrate"
						bind:value={
							() => {
								if (inputStore.flowRateM3s === null) {
									return null;
								}
								const displayValue = inputStore.flowRateM3s / inputStore.flowRateSeries.value;
								return inputStore.flowPriority
									? parseFloat(displayValue.toPrecision(12))
									: smartRound(displayValue, 3);
							},
							(v) => {
								if (v === null) {
									inputStore.flowRateM3s = null;
								} else {
									inputStore.flowRateM3s = v * inputStore.flowRateSeries.value;
								}
							}
						}
						onfocus={(e) => {
							const target = e.target as HTMLInputElement | null;
							if (!target) return;
							inputStore.flowPriority = true;
							tick().then(() => {
								target.select();
							});
						}}
					/>
					<Select.Root
						type="single"
						bind:value={inputStore.flowRateSeries.label}
						onValueChange={(label) =>
							(inputStore.flowRateSeries =
								flowRateSeriesData.find((d) => d.label === label) ?? flowRateSeriesData[0])}
					>
						<Select.Trigger class="w-[80px]">{inputStore.flowRateSeries.label}</Select.Trigger>
						<Select.Content>
							<Select.Label>Enheter</Select.Label>
							{#each flowRateSeriesData as option}
								<Select.Item value={option.label} label={option.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5 pb-4">
				<Label for="power">Effekt</Label>
				<div class="flex flex-row gap-x-2">
					<Input
						type="number"
						class="w-full md:w-[120px] {inputStore.flowPriority ? 'text-muted-foreground' : ''}"
						id="power"
						bind:value={
							() => {
								if (inputStore.powerW === null) return null;
								const displayValue = inputStore.powerW / inputStore.powerSeries.value;
								return !inputStore.flowPriority
									? parseFloat(displayValue.toPrecision(12))
									: smartRound(displayValue, 3);
							},
							(v) => {
								if (v === null) {
									inputStore.powerW = null;
								} else {
									inputStore.powerW = v * inputStore.powerSeries.value;
								}
							}
						}
						onfocus={(e) => {
							const target = e.target as HTMLInputElement | null;
							if (!target) return;
							inputStore.flowPriority = false;
							tick().then(() => {
								target.select();
							});
						}}
					/>
					<Select.Root
						type="single"
						bind:value={inputStore.powerSeries.label}
						onValueChange={(label) =>
							(inputStore.powerSeries = powerData.find((d) => d.label === label) ?? powerData[0])}
					>
						<Select.Trigger class="w-[80px]">{inputStore.powerSeries.label}</Select.Trigger>
						<Select.Content>
							<Select.Label>Enheter</Select.Label>
							{#each powerData as option}
								<Select.Item value={option.label} label={option.label} />
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</Card.Content>
		<Card.Header>
			<Card.Title
				onclick={() => (propertiesVisible = !propertiesVisible)}
				class="cursor-pointer flex flex-row items-center gap-x-2 text-muted-foreground hover:text-foreground transition-colors"
				>Avancerade inställningar <ChevronRight
					size={16}
					class="{propertiesVisible ? 'rotate-90' : ''} transition-all"
				/></Card.Title
			>
		</Card.Header>

		{#if propertiesVisible}
			<Card.Content>
				<div transition:slide class="flex flex-col pt-2">
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="supply">Relativ fukt</Label>
						<SliderWithLabel
							type="single"
							thumbLabel={inputStore.relativeHumidity.toFixed(0) + '%'}
							bind:value={inputStore.relativeHumidity}
							max={100}
							step={1}
							class="max-w-[100%] pt-2 mt-8"
						/>
					</div>
					<div
						class="p-2 mt-4 rounded-md flex w-full max-w-sm flex-col gap-2.5 font-mono text-xs bg-foreground/2 dark:bg-foreground/5 text-foreground"
					>
						{#if airPropertiesStore.isLoading}
							Beräkningsfel!
						{:else}
							<span>Beräkningstemperatur: {inputStore.calcTemperature.toFixed(1)} °C</span>
							<span>Daggpunkt: {airPropertiesStore.dewPoint.toFixed(1)} °C</span>
							<span>Våta temperaturen: {airPropertiesStore.wetBulb.toFixed(1)} °C</span>
							<span>Densitet: {airPropertiesStore.airDensity.toFixed(3)} kg/m³</span>
							<span
								>Värmekapacitet: {(airPropertiesStore.specificHeatCapacity / 1000).toFixed(3)} kJ/(kg/K)</span
							>
						{/if}
					</div>
				</div>
			</Card.Content>
		{/if}
	</Card.Root>

	<Card.Root class="flex w-full md:flex-1">
		<Card.Header>
			<Card.Title>Resultat</Card.Title>
			<Card.Description>Beräknade tryckfall och hastigheter.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						{#if !useRectangular}
							<Table.Head class="text-center font-semibold"
								>DN<br /><span class="text-muted-foreground italic text-xs">mm</span></Table.Head
							>
						{:else}
							<Table.Head class="text-center font-semibold"
								>Bredd<br /><span class="text-muted-foreground italic text-xs">mm</span></Table.Head
							>
							<Table.Head class="text-center font-semibold">×</Table.Head>
							<Table.Head class="text-center font-semibold"
								>Höjd<br /><span class="text-muted-foreground italic text-xs">mm</span></Table.Head
							>{/if}
						<Table.Head class="text-center font-semibold"
							>Hastighet <br /><span class="text-muted-foreground italic text-xs">m/s</span
							></Table.Head
						>
						<Table.Head class="text-center font-semibold hidden md:block"
							>Reynolds <br />tal</Table.Head
						>
						<Table.Head class="text-center font-semibold"
							>Tryckfall<br /><span class="text-muted-foreground italic text-xs">Pa/m</span
							></Table.Head
						>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each ductArray as duct, i}
						<Table.Row
							style="color: color-mix(in oklch, var(--background), var(--foreground) {getBellCurveValue(
								0.2,
								1,
								0.8,
								isNaN(duct.pressureDrop) ? 0 : duct.pressureDrop
							) * 100}%"
							class="hover:text-foreground! transition-none"
						>
							{#if !useRectangular}
								<Table.Cell class="font-medium text-center"
									><input
										class="w-[40px] text-center no-spinner"
										type="number"
										bind:value={inputStore.ductSeries.dn[i]}
										onfocus={(e) => {
											const target = e.target as HTMLInputElement | null;
											if (!target) return;
											target.select();
										}}
									/></Table.Cell
								>
							{:else}
								<Table.Cell class="font-medium text-center"
									><input
										class="w-[40px] text-center no-spinner"
										type="number"
										bind:value={inputStore.ductSeries.rect[i][0]}
										onfocus={(e) => {
											const target = e.target as HTMLInputElement | null;
											if (!target) return;
											target.select();
										}}
									/></Table.Cell
								>
								<Table.Cell class="font-medium text-center">×</Table.Cell>
								<Table.Cell class="font-medium text-center"
									><input
										class="w-[40px] text-center no-spinner"
										type="number"
										bind:value={inputStore.ductSeries.rect[i][1]}
										onfocus={(e) => {
											const target = e.target as HTMLInputElement | null;
											if (!target) return;
											target.select();
										}}
									/></Table.Cell
								>
							{/if}
							<Table.Cell class="text-center relative">
								{#if airPropertiesStore.isLoading || flowInfinity}
									<span
										transition:fly
										class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 align-center w-[56px] rounded-md h-[22px] bg-muted animate-pulse"
									></span>
								{:else}
									<span transition:fly>{smartRound(duct.velocity, 3)}</span>
								{/if}
							</Table.Cell>

							<Table.Cell class="text-center md:table-cell hidden relative">
								{#if airPropertiesStore.isLoading || flowInfinity}
									<span
										transition:fly
										class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 align-center w-[56px] rounded-md h-[22px] bg-muted animate-pulse"
									></span>
								{:else}
									<span transition:fly>{smartRound(duct.reynoldsNumber, 0)}</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-center overflow-x-clip relative">
								{#if airPropertiesStore.isLoading || flowInfinity}
									<span
										transition:fly
										class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 align-center w-[56px] rounded-md h-[22px] bg-muted animate-pulse"
									></span>
								{:else}
									<span transition:fly>{duct.pressureDrop.toFixed(2)}</span>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
