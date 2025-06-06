<script>
	// --- IMPORT DEFINITIONS ---
	// --- We load UI-relevant modules here ---
	import { slide, fly } from 'svelte/transition';
	import { tick } from 'svelte';

	import { getBellCurveValue } from '$lib/utils/bellCurveUtils.js';
	import { smartRound } from '$lib/utils/smartRound';

	// -- We load layout-relevant modules here ---
	import InputLabel from '$lib/components/InputLabel.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import * as Table from '$lib/components/ui/table/index.js';

	import { ChevronRight } from '@lucide/svelte';

	// --- We load program related modules ---
	import CoolProp from './components/PipeCoolProp.svelte'; // Import the new component
	import { fluidPropertiesStore } from '../ror/components/fluidPropertiesStore.js'; // Import the air properties store
	import { inputStore } from '../ror/components/inputStore.js'; // Import the fluid properties store
	import { calculatePressureDrop, colebrook } from '../components/calculations.js'; // Import the pressure drop calculation function

	// --- We load Swedish standard ductt series, flow rate units, and power units ---
	import pipeSeriesData from '../ror/components/pipe.series.json';
	import flowRateSeriesData from '../ror/components/pipe.flow.rate.json';
	import fluidSeriesData from '../ror/components/fluidTypes.json';
	import powerData from '../ror/components/power.json';

	// --- VARIABLE DEFINITIONS ---
	// --- Local UI states ---
	let propertiesVisible = $state(false);

	// --- State Variables ---

	// Initialize standard values
	let flowRateSeries = $state(flowRateSeriesData[0]);
	let powerSeries = $state(powerData[0]);
	let pipeSeries = $state(pipeSeriesData[0]);
	let fluidSeries = $state(fluidSeriesData[0]);
	let roughness = $derived(pipeSeries.roughness);
	let TRANSITIONLIMIT = 2300;
	let TRANSITION_INTERVAL = 500;
	let flowRateM3s = $state(0); // Flow rate in m³/s
	let powerW = $state(2000); // Power in Watts
	let flowPriority = $state(false); // Flow rate priority for calculations

	$effect(() => {
		if (flowPriority) {
			// If flow rate is prioritized, calculate power based on flow rate
			powerW =
				flowRateM3s *
				$fluidPropertiesStore.density *
				$fluidPropertiesStore.specificHeatCapacity *
				($inputStore.inletTemperature - $inputStore.outletTemperature);
		} else {
			// If power is prioritized, calculate flow rate based on power
			flowRateM3s =
				powerW /
				($fluidPropertiesStore.density *
					$fluidPropertiesStore.specificHeatCapacity *
					($inputStore.inletTemperature - $inputStore.outletTemperature));
		}
	});

	let pipeArray = $derived.by(() => {
		return pipeSeries.dIn.map((dInValue) => {
			var diameter = dInValue / 1000; // Convert DN to meters
			const velocity = Math.abs(flowRateM3s) / (Math.PI * Math.pow(diameter / 2, 2)); // Calculate velocity in m/s
			const hydraulicDiameter = diameter; // For circular ducts, hydraulic diameter is the same as diameter
			const reynoldsNumber =
				(velocity * hydraulicDiameter) / $fluidPropertiesStore.kinematicViscosity; // Calculate Reynolds number
			const frictionFactor = colebrook(reynoldsNumber, roughness / (hydraulicDiameter * 1000)); // Calculate friction factor using Colebrook equation
			const pressureDrop = calculatePressureDrop(
				$fluidPropertiesStore.dynamicViscosity,
				$fluidPropertiesStore.density,
				hydraulicDiameter,
				velocity,
				reynoldsNumber,
				frictionFactor,
				TRANSITIONLIMIT,
				TRANSITION_INTERVAL
			);
			return { dn: dInValue, diameter, velocity, reynoldsNumber, frictionFactor, pressureDrop };
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
					bind:value={pipeSeries.name}
					onValueChange={(name) =>
						(pipeSeries = pipeSeriesData.find((d) => d.name === name) ?? pipeSeriesData[0])}
				>
					<Select.Trigger class="w-[220px]">{pipeSeries.name}</Select.Trigger>
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
							bind:value={$inputStore.inletTemperature}
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
							bind:value={$inputStore.outletTemperature}
						/>
						<span>°C</span>
					</div>
				</div>
			</div>
			<div class="flex w-full max-w-sm flex-col gap-1.5 pb-4">
				<Label for="supply">Vätskeflöde</Label>
				<div class="flex flex-row gap-x-2">
					<Input
						type="number"
						class="w-full md:w-[120px] {!flowPriority ? 'text-muted-foreground' : ''}"
						id="flowrate"
						step="0.01"
						bind:value={
							() => {
								if (flowRateM3s === null) {
									return null;
								}
								const displayValue = flowRateM3s / flowRateSeries.value;
								return flowPriority
									? parseFloat(displayValue.toPrecision(12))
									: smartRound(displayValue, 3);
							},
							(v) => {
								if (v === null) {
									flowRateM3s = null;
								} else {
									flowRateM3s = v * flowRateSeries.value;
								}
							}
						}
						onfocus={(e) => {
							if (!e.target) return;
							flowPriority = true;
							tick().then(() => {
								e.target.select();
							});
						}}
					/>
					<Select.Root
						type="single"
						bind:value={flowRateSeries.label}
						onValueChange={(label) =>
							(flowRateSeries =
								flowRateSeriesData.find((d) => d.label === label) ?? flowRateSeriesData[0])}
					>
						<Select.Trigger class="w-[80px]">{flowRateSeries.label}</Select.Trigger>
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
						class="w-full md:w-[120px] {flowPriority ? 'text-muted-foreground' : ''}"
						id="power"
						bind:value={
							() => {
								if (powerW === null) return null;
								const displayValue = powerW / powerSeries.value;
								return !flowPriority
									? parseFloat(displayValue.toPrecision(12))
									: smartRound(displayValue, 3);
							},
							(v) => {
								if (v === null) {
									powerW = null;
								} else {
									power((powerW = v * powerSeries.value));
								}
							}
						}
						onfocus={(e) => {
							flowPriority = false;
							tick().then(() => {
								e.target.select();
							});
						}}
					/>
					<Select.Root
						type="single"
						bind:value={powerSeries.label}
						onValueChange={(label) =>
							(powerSeries = powerData.find((d) => d.label === label) ?? powerData[0])}
					>
						<Select.Trigger class="w-[80px]">{powerSeries.label}</Select.Trigger>
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
					<Select.Root
						type="single"
						bind:value={fluidSeries.value}
						onValueChange={(value) =>
							(fluidSeries = fluidSeriesData.find((d) => d.value === value) ?? fluidSeriesData[0])}
					>
						<Select.Trigger class="w-[220px]">{fluidSeries.label}</Select.Trigger>
						<Select.Content>
							<Select.Label>Köldbärare</Select.Label>
							{#each fluidSeriesData as option}
								<Select.Item value={option.value} label={option.label} />
							{/each}
						</Select.Content>
					</Select.Root>
					<div class="flex w-full max-w-sm flex-col gap-2.5">
						<Label for="thermal-capacity"
							>Värmekapacitet: {$fluidPropertiesStore.specificHeatCapacity.toFixed(0)} J/kg·K</Label
						>
						<Label for="density">Densitet: {$fluidPropertiesStore.density.toFixed(3)} kg/m³</Label>
						<Label for="roughness">Råhet: {pipeSeries.roughness} mm</Label>
						<Label for="fluid">Köldbärare: {fluidSeries.label} {fluidSeries.value}</Label>
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
					{#each pipeArray as duct, i}
						<Table.Row
							class="hover:!opacity-100"
							style="opacity: {getBellCurveValue(0.2, 1, 0.8, duct.pressureDrop / 100)}"
						>
							<Table.Cell class="font-medium text-center"
								><input
									class="w-[50px] text-center no-spinner"
									type="number"
									bind:value={pipeSeries.dn[i]}
									onfocus={(e) => {
										e.target.select();
									}}
								/></Table.Cell
							>

							<Table.Cell class="text-center">{duct.velocity.toFixed(2)}</Table.Cell>
							<Table.Cell class="text-center md:block hidden"
								>{duct.reynoldsNumber.toPrecision(5)}</Table.Cell
							>
							<Table.Cell class="text-center overflow-x-clip">
								{duct.pressureDrop.toFixed(0)}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</div>
