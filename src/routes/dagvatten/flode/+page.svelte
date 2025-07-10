<script lang="ts">
	import { smartRound } from '$lib/utils/smartRound';

	// -- We load layout-relevant modules here ---

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	import { ChevronRight, CircleAlert, TriangleAlert } from '@lucide/svelte';
	import TakArea from '$lib/components/images/projicerad-takarea.svelte';

	let returnTimeYear = $state(5); // Återkomsttid i år
	let returnTimeMonth = $derived(returnTimeYear * 12); // Återkomsttid i månader
	let duration = $state(10); // Varaktighet i minuter
	let rainIntensity = $derived(
		((190 * returnTimeMonth ** (1 / 3) * Math.log(duration)) / duration ** 0.98 + 2) / 10000
	);
	let projectedArea = $state(100); // m²
	let surfaceCoefficient = $state(1); // 0-1
	let riskFactor = $state(0.5); // 0-1
	let probableFlow = $derived(
		smartRound(rainIntensity * projectedArea * surfaceCoefficient * riskFactor, 3)
	);
</script>

<div
	class="grid md:grid-cols-[10fr_16fr] grid-rows-1 divide-dashed md:divide-x-1 md:divide-y-0 divide-y-1 md:border-b-1 border-dashed"
>
	<div class="p-4">
		<h1>Sannolikt flöde för dagvatten</h1>
		<p>Beräkning av sannolikt flöde för avvattning av takyta enligt Dahlström (2010).</p>
		<div class="grid grid-cols-[20fr_16fr_4fr] items-center gap-2 max-w-xs">
			<Label>Återkomsttid</Label>
			<Input type="number" step="1" bind:value={returnTimeYear} />
			<span class="text-sm">år</span>
			<Label>Varaktighet</Label>
			<Input type="number" step="1" bind:value={duration} />
			<span class="text-sm">minuter</span>
			<Label>Regnintensitet</Label>
			<Input type="number" disabled bind:value={rainIntensity} />
			<span class="text-sm">l/sm²</span>
			<hr class="col-span-full my-2 border-dashed" />
			<Label>Projicerad yta</Label>
			<Input type="number" bind:value={projectedArea} />
			<span class="text-sm">m²</span>
			<Label>Ytkoefficient</Label>
			<Input type="number" step="0.1" bind:value={surfaceCoefficient} />
			<span class="text-sm"></span>
			<Label>Riskfaktor</Label>
			<Input type="number" step="0.1" bind:value={riskFactor} />
			<span class="text-sm"></span>
			<hr class="col-span-full my-2 border-dashed" />
			<Label class="font-semibold text-md">Sannolikt flöde</Label>
			<span class="text-md font-semibold col-span-2">
				{probableFlow}
				l/s
			</span>
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
		<div class="p-2 flex">
			<TakArea width={300} />
		</div>

		<hr />
		<h2>Ytkoefficient</h2>

		<p>
			Ytkoefficient är ett värde som visar hur pass mycket en yta släpper igenom vatten. Ju högre
			siffra detso mindre vattensläpper ytan igenom.
		</p>
		<table class="table-fixed text-sm border-spacing-2 border-collapse">
			<thead class="border-b-1">
				<tr>
					<th class="text-left w-[200px]">Typ av yta</th>
					<th>Area</th>
					<th>Ytkoefficient</th>
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
			siffra detso mindre vattensläpper ytan igenom.
		</p>
	</div>
</div>

<style>
	th,
	td {
		padding: 5px;
	}
</style>
