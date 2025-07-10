<script lang="ts">
	import { smartRound } from '$lib/utils/smartRound';

	// -- We load layout-relevant modules here ---

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import { Toilet } from '@lucide/svelte';
	import Washbasin from '$lib/icons/washbasin.svelte';
	import Sink from '$lib/icons/sink.svelte';

	let washbasinFlow = 0.3; // l/s
	let toiletFlow = 1.8; // l/s
	let sinkFlow = 0.6; // l/s
</script>

<div
	class="grid md:grid-cols-[16fr_16fr] grid-rows-1 divide-dashed md:divide-x-1 md:divide-y-0 divide-y-1 md:border-b-1 border-dashed"
>
	<div class="p-4">
		<h1>Inställningar för enheter</h1>

		<div class="grid grid-cols-[34px_80px_60px_1fr] gap-4">
			<div class="border-1 bg-card shadow-2x inline-flex p-1 rounded-md">
				<Washbasin size={24} />
			</div>
			<Label>Tvättställ</Label>
			<Input
				type="number"
				bind:value={washbasinFlow}
				min={1}
				max={10}
				step={0.1}
				class="ml-2 shadow-none"
			/>
			<Label>l/s</Label>
			<div class="border-1 bg-card shadow-2x inline-flex p-1 rounded-md">
				<Toilet size={24} />
			</div>
			<Label>Vattenklosett</Label>
			<Input
				type="number"
				bind:value={toiletFlow}
				min={1}
				max={10}
				step={0.1}
				class="ml-2 shadow-none"
			/>
			<Label>l/s</Label>
			<div class="border-1 bg-card shadow-2x inline-flex p-1 rounded-md">
				<Sink size={24} />
			</div>
			<Label>Diskho</Label>
			<Input
				type="number"
				bind:value={sinkFlow}
				min={1}
				max={10}
				step={0.1}
				class="ml-2 shadow-none"
			/>
			<Label>l/s</Label>
		</div>
	</div>
	<div class="p-4">
		<h1>Faktorer</h1>
		<hr />
		<h2>Regnintensitet</h2>

		<p>
			Denna beräkning den något senare formeln för regnintensitet enligt Dahlström (2010). Den
			större skillnaden är att regnintensiteten är något högre än vad som tidgiare brukat ansättas.
			Praxis för dimensionering är att ansätta <u>10-årsregn</u> med en varaktighet om
			<u>5 minuter</u>.
		</p>
		<hr />
		<h2>Projicerad yta</h2>

		<p>Den horisontellt projicerade takyta som träffas av regnet.</p>
		<div class="p-2 flex"></div>

		<hr />
		<h2>Ytkoefficient</h2>

		<p>
			Ytkoefficient är ett värde som visar hur pass mycket en yta släpper igenom vatten. Ju högre
			siffra detso mindre vattensläpper ytan igenom.
		</p>
		<table class="table-tryckfall table-fixed text-sm border-spacing-2 border-collapse w-full">
			<thead class="border-b-1">
				<tr>
					<th class="text-left">Typ av yta</th>
					<th class="w-[150px]">Area</th>
					<th class="w-[100px]">Ytkoefficient</th>
				</tr>
			</thead>
			<tbody class="text-center">
				<tr>
					<td class="text-left">Trädgårdstomt</td>
					<td>&lt; 1 500 m²</td>
					<td>0,3</td>
				</tr>
				<tr>
					<td class="text-left">Gräsytor</td>
					<td>&ge; 1 500 m²</td>
					<td>0,6</td>
				</tr>
				<tr>
					<td class="text-left">Gräsyta på obehandlad mark</td>
					<td>&ge; 1 500 m²</td>
					<td>0,1</td>
				</tr>
				<tr>
					<td class="text-left">Takyta och annan yta med tät beläggning t ex asfalt, betong</td>
					<td>-</td>
					<td>0,6</td>
				</tr>
				<tr>
					<td class="text-left">Annan yta oavsett typ av beläggning</td>
					<td>&lt; 1 500 m²</td>
					<td>1,0</td>
				</tr>
			</tbody>
		</table>
		<hr />
		<h2>Riskfaktor</h2>

		<p>
			Ytkoefficient är ett värde som visar hur pass mycket en yta släpper igenom vatten. Ju högre
			siffra desto mindre vattensläpper ytan igenom.
		</p>

		<table class="table-tryckfall table-fixed text-sm border-spacing-2 border-collapse w-full">
			<thead class="border-b-1">
				<tr>
					<th class="text-left">Typ av avvattning</th>
					<th class="w-[60px]">&Upsilon; </th>
				</tr>
			</thead>
			<tbody class="text-center">
				<tr>
					<td class="text-left">Utvändig avvattning</td>
					<td>0,3</td>
				</tr>
				<tr>
					<td class="text-left"
						>Utvändig avvattning där översvämning kan skapa problem som tex över ingångar till
						offentliga byggnader.</td
					>
					<td>1,5</td>
				</tr>
				<tr>
					<td class="text-left"
						>Invändig avvattning eller där ovanligt kraftiga regn kan skapa läckage in i byggnaden.</td
					>
					<td>2,0</td>
				</tr>
				<tr>
					<td class="text-left"
						>Invändig avvattning där högt skydd krävs som sjukhus, byggnader som är kritiska för
						kommunikation, byggnader med dyrbar konst, lager med varor som bildar giftiga gaser
						eller blir brandfarliga vid kontakt med vatten.</td
					>
					<td>3,0</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

<style>
</style>
