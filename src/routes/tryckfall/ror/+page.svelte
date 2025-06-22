<script lang="ts">
	// --- IMPORT DEFINITIONS ---
	// --- We load UI-relevant modules here ---
	import { slide, fly, crossfade, draw } from 'svelte/transition';
	import { tick } from 'svelte';

	import { getBellCurveValue } from '$lib/utils/bellCurveUtils.js';
	import { smartRound } from '$lib/utils/smartRound';
	import ChemicalFormula from '$lib/utils/ChemicalFormula.svelte';

	// -- We load layout-relevant modules here ---
	import InputLabel from '$lib/components/InputLabel.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { SliderWithLabel } from '$lib/components/ui/slider/index.js';

	import * as Table from '$lib/components/ui/table/index.js';

	import { ChevronRight, CircleAlert, TriangleAlert } from '@lucide/svelte';

	// --- We load program related modules ---
	import CoolProp from './components/PipeCoolProp.svelte'; // Import the new component
	import { fluidPropertiesStore } from '../ror/components/fluidPropertiesStore.svelte.js'; // Import the air properties store
	import { inputStore } from './components/inputStore.svelte.js'; // Import the fluid properties store
	import { calculatePressureDrop, colebrook } from '../components/calculations.js'; // Import the pressure drop calculation function

	// --- We load Swedish standard pipe series, flow rate units, and power units ---
	import pipeSeriesData from '../ror/components/pipe.series.json';
	import flowRateSeriesData from '../ror/components/pipe.flow.rate.json';
	import fluidSeriesData from '../ror/components/fluidTypes.json';
	import powerData from '../ror/components/power.json';

	$inspect(fluidSeriesData);

	// --- VARIABLE DEFINITIONS ---
	// --- Local UI states ---
	let propertiesVisible = $state(false);
	let temperatureError = $derived(
		inputStore.inletTemperature > fluidPropertiesStore.maxT ||
			inputStore.outletTemperature > fluidPropertiesStore.maxT ||
			inputStore.inletTemperature < fluidPropertiesStore.freezeT ||
			inputStore.outletTemperature < fluidPropertiesStore.freezeT
	);
	let flowInfinity = $derived(inputStore.inletTemperature === inputStore.outletTemperature);

	// Initialize standard values
	//let flowRateSeries = $state(flowRateSeriesData[0]);
	//let powerSeries = $state(powerData[0]);
	let roughness = $derived(inputStore.pipeSeries.roughness);

	$effect(() => {
		if (inputStore.flowPriority) {
			// If flow rate is prioritized, calculate power based on flow rate
			inputStore.powerW =
				(inputStore.flowRateM3s ?? 0) *
				fluidPropertiesStore.density *
				fluidPropertiesStore.specificHeatCapacity *
				(inputStore.inletTemperature - inputStore.outletTemperature);
		} else {
			// If power is prioritized, calculate flow rate based on power
			inputStore.flowRateM3s =
				(inputStore.powerW ?? 0) /
				(fluidPropertiesStore.density *
					fluidPropertiesStore.specificHeatCapacity *
					(inputStore.inletTemperature - inputStore.outletTemperature));
		}
	});

	let pipeArray = $derived.by(() => {
		return inputStore.pipeSeries.dIn.map((dInValue) => {
			const diameter = dInValue / 1000; // Convert DN to meters
			const velocity =
				Math.abs(inputStore.flowRateM3s ?? 0) / (Math.PI * Math.pow(diameter / 2, 2)); // Calculate velocity in m/s
			const hydraulicDiameter = diameter; // For circular pipes, hydraulic diameter is the same as diameter
			const reynoldsNumber =
				(velocity * hydraulicDiameter) / fluidPropertiesStore.kinematicViscosity; // Calculate Reynolds number
			const frictionFactor = colebrook(reynoldsNumber, roughness / (hydraulicDiameter * 1000)); // Calculate friction factor using Colebrook equation
			const pressureDrop = calculatePressureDrop(
				fluidPropertiesStore.dynamicViscosity,
				fluidPropertiesStore.density,
				hydraulicDiameter,
				velocity,
				reynoldsNumber,
				frictionFactor,
				inputStore.TRANSITIONLIMIT,
				inputStore.TRANSITION_INTERVAL
			);
			return {
				dIn: dInValue,
				diameter,
				velocity,
				reynoldsNumber,
				frictionFactor,
				pressureDrop
			};
		});
	});
</script>

<!-- Instantiate CoolProp component (renders nothing, just runs logic) -->
<CoolProp />

<div class="flex flex-col md:flex-row gap-6 items-start">
	<Card.Root class="flex w-full md:w-[290px] gap-y-0">
		<Card.Header class="pb-4">
			<Card.Title>Inställningar</Card.Title>
			<Card.Description>Ange inställningar för att beräkna tryckfall i rör.</Card.Description>
		</Card.Header>
		<Card.Content class="flex flex-col">
			<div class="flex w-full max-w-sm flex-col gap-1.5 pb-4">
				<Label for="material">Rörtyp</Label>
				<Select.Root
					type="single"
					bind:value={inputStore.pipeSeries.name}
					onValueChange={(name) =>
						(inputStore.pipeSeries =
							pipeSeriesData.find((d) => d.name === name) ?? pipeSeriesData[0])}
				>
					<Select.Trigger class="w-[220px]">{inputStore.pipeSeries.name}</Select.Trigger>
					<Select.Content>
						<Select.Label>Kanalmaterial</Select.Label>
						{#each pipeSeriesData as option}
							<Select.Item value={option.name} label={option.name} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="flex flex-row gap-x-5">
				<div class="flex md:max-w-sm flex-col gap-1.5 pb-4">
					<Label for="supply">Tillopp</Label>
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
					<Label for="supply">Retur</Label>
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
			{#if temperatureError}
				<div
					transition:slide
					class="border-1 p-2 rounded-md border-destructive text-sm mb-4 flex flex-row items-center gap-x-2"
				>
					<TriangleAlert class="flex text-destructive size-[28px]" /><span class="flex-1">
						Temperatur måste begränsas mellan {parseFloat(fluidPropertiesStore.freezeT.toFixed(1))} °C
						och {parseFloat(fluidPropertiesStore.maxT.toFixed(1))}
						°C.
					</span>
				</div>
			{:else if !temperatureError && !fluidPropertiesStore.isLoading}
				<div transition:slide>
					<div class="flex w-full max-w-sm flex-col gap-1.5 pb-4">
						<Label for="supply">Vätskeflöde</Label>
						<div class="flex flex-row gap-x-2">
							<Input
								type="number"
								class="w-full md:w-[120px] {!inputStore.flowPriority
									? 'text-muted-foreground'
									: ''}"
								id="flowrate"
								step="0.01"
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
									(inputStore.powerSeries =
										powerData.find((d) => d.label === label) ?? powerData[0])}
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
				</div>
			{/if}
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
					<Select.Root
						type="single"
						value={inputStore.fluidType.value}
						onValueChange={(x) =>
							(inputStore.fluidType =
								fluidSeriesData.find((d) => d.value === x) ?? fluidSeriesData[0])}
					>
						<Select.Trigger class="w-[220px]"
							><ChemicalFormula formula={inputStore.fluidType.label} /></Select.Trigger
						>
						<Select.Content>
							<Select.Label>Köldbärare</Select.Label>
							{#each fluidSeriesData as option}
								<Select.Item value={option.value}
									><ChemicalFormula formula={option.label} /></Select.Item
								>
							{/each}
						</Select.Content>
					</Select.Root>

					{#if inputStore.fluidType.value != 'Water'}
						<div transition:slide>
							<Label for="concentration" class="pt-4">Koncentration</Label>
							<SliderWithLabel
								type="single"
								thumbLabel={(inputStore.concentration * 100).toFixed(0) + '%'}
								bind:value={inputStore.concentration}
								max={inputStore.fluidType.xmax}
								step={0.01}
								class="max-w-[100%] pt-2 mt-8"
							/>
						</div>
					{/if}

					<div
						class="p-2 mt-4 rounded-md flex w-full max-w-sm flex-col gap-2.5 font-mono text-xs bg-foreground/2 dark:bg-foreground/5 text-foreground"
					>
						<span
							>Värmekapacitet: {fluidPropertiesStore.specificHeatCapacity.toFixed(0)} J/kg·K</span
						>
						<span>Densitet: {fluidPropertiesStore.density.toFixed(3)} kg/m³ </span><span>
							Råhet: {inputStore.pipeSeries.roughness} mm
						</span>
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
				<Table.Caption
					><div class="inline-flex items-center gap-x-1">
						<CircleAlert size="16px" />Laminär strömning
					</div></Table.Caption
				>
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-center font-semibold"
							>DN<br /><span class="text-muted-foreground italic text-xs">mm</span></Table.Head
						>
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
					{#each pipeArray as pipe, i}
						<Table.Row
							style="color: color-mix(in oklch, var(--foreground) var(--background) {(
								getBellCurveValue(0.2, 1, 0.8, pipe.pressureDrop / 100) * 100
							).toFixed(0)}%)"
						>
							<Table.Cell class="font-medium text-center">{inputStore.pipeSeries.dn[i]}</Table.Cell>
							<Table.Cell class="text-center table-cell relative">
								{#if temperatureError || flowInfinity || fluidPropertiesStore.isLoading}<span
										transition:fly
										class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 align-center w-[56px] rounded-md h-[22px] bg-muted animate-pulse"
									></span>{:else}
									<div class="flex justify-center items-center gap-x-1 relative w-fit mx-auto">
										{pipe.velocity.toFixed(2)}
										{#if pipe.reynoldsNumber < inputStore.TRANSITIONLIMIT}<CircleAlert
												size="16px"
												class="absolute left-full translate-x-2 opacity-25"
											/>{:else}{/if}
									</div>
								{/if}</Table.Cell
							>

							<Table.Cell class="text-center md:table-cell hidden relative"
								>{#if temperatureError || flowInfinity || fluidPropertiesStore.isLoading}<span
										transition:fly
										class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 align-center w-[56px] rounded-md h-[22px] bg-muted animate-pulse"
									></span>{:else}<span transition:fly>{pipe.reynoldsNumber.toFixed(0)}</span>{/if}
							</Table.Cell>
							<Table.Cell class="text-center table-cell relative">
								{#if temperatureError || flowInfinity || fluidPropertiesStore.isLoading}<span
										transition:fly
										class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 align-center w-[56px] rounded-md h-[22px] bg-muted animate-pulse"
									></span>{:else}<span transition:fly>{pipe.pressureDrop.toFixed(0)}</span>{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
