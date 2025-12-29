<script>
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { smartRound } from '$lib/utils/smartRound';
	import * as Select from '$lib/components/ui/select/index.js';

	let calculationMode = $state('volume'); // 'volume', 'inflow', 'outflow', 'time'

	// Sate variables for inputs (strings to handle empty states easily)
	// qt = Inkommande flöde (l/s)
	// tq = Tömningstid (s)
	// qa = Avgående flöde (l/s)
	// V = Buffert volym (l)

	let qt = $state(10);
	let tq = $state(60);
	let qa = $state(5);
	let V = $state(300);

	// Derived values based on calculation mode
	// We use an effect to update the "locked" variable when others change
	let calculatedValue = $derived.by(() => {
		if (calculationMode === 'volume') {
			// V = (qt - qa) * tq
			return (qt - qa) * tq;
		} else if (calculationMode === 'inflow') {
			// qt = V / tq + qa
			return tq > 0 ? V / tq + qa : 0;
		} else if (calculationMode === 'outflow') {
			// qa = qt - V / tq
			return tq > 0 ? qt - V / tq : 0;
		} else if (calculationMode === 'time') {
			// tq = V / (qt - qa)
			return qt - qa !== 0 ? V / (qt - qa) : 0;
		}
		return 0;
	});

	// Update the state of the locked variable whenever the calculation result changes
	$effect(() => {
		if (calculationMode === 'volume') V = smartRound(calculatedValue, 2);
		else if (calculationMode === 'inflow') qt = smartRound(calculatedValue, 2);
		else if (calculationMode === 'outflow') qa = smartRound(calculatedValue, 2);
		else if (calculationMode === 'time') tq = smartRound(calculatedValue, 2);
	});

	// Helper to set mode
	function setMode(mode) {
		calculationMode = mode;
	}

	const unitOptions = {
		flow: [
			{ value: 'l_s', label: 'l/s' },
			{ value: 'l_min', label: 'l/min' },
			{ value: 'm3_h', label: 'm³/h' }
		],
		time: [
			{ value: 's', label: 's' },
			{ value: 'min', label: 'min' },
			{ value: 'h', label: 'h' }
		],
		volume: [
			{ value: 'l', label: 'l' },
			{ value: 'm3', label: 'm³' }
		]
	};
</script>

<div class="container mx-auto max-w-4xl py-6">
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold tracking-tight">Buffertvolym</h1>
		<p class="text-muted-foreground text-lg">
			Beräknar erfoderlig buffertvolym för mellanlagring av spillvatten.
		</p>
	</div>

	<div class="grid gap-8 lg:grid-cols-[2fr_1fr]">
		<div class="space-y-6">
			<!-- Calculation Card -->
			<div class="bg-card rounded-xl border shadow-sm">
				<div class="border-b p-6 pb-4">
					<h2 class="text-lg font-semibold">Beräkning</h2>
					<p class="text-muted-foreground text-sm">
						Välj vilken variabel du vill beräkna genom att klicka på knapparna nedan eller markera
						resultatfältet.
					</p>
				</div>

				<div class="space-y-6 p-6">
					<!-- Inkommande flöde (qt) -->
					<div class="grid items-center gap-2 sm:grid-cols-[1.5fr_1fr] sm:gap-4">
						<Label
							class={calculationMode === 'inflow'
								? 'text-primary text-base font-bold'
								: 'text-base'}
						>
							Inkommande flöde (q<sub>t</sub>)
						</Label>
						<div class="relative">
							<Input
								type="number"
								bind:value={qt}
								readonly={calculationMode === 'inflow'}
								class="{calculationMode === 'inflow'
									? 'bg-primary/5 border-primary text-foreground ring-primary/20 font-medium'
									: ''} pr-12 transition-all duration-200"
								step="0.1"
							/>
							<span
								class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm select-none"
								>l/s</span
							>
						</div>
					</div>

					<!-- Tömningstid (tq) -->
					<div class="grid items-center gap-2 sm:grid-cols-[1.5fr_1fr] sm:gap-4">
						<Label
							class={calculationMode === 'time' ? 'text-primary text-base font-bold' : 'text-base'}
						>
							Tömningstid (t<sub>q</sub>)
						</Label>
						<div class="relative">
							<Input
								type="number"
								bind:value={tq}
								readonly={calculationMode === 'time'}
								class="{calculationMode === 'time'
									? 'bg-primary/5 border-primary text-foreground ring-primary/20 font-medium'
									: ''} pr-12 transition-all duration-200"
								step="1"
							/>
							<span
								class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm select-none"
								>s</span
							>
						</div>
					</div>

					<!-- Avgående flöde (qa) -->
					<div class="grid items-center gap-2 sm:grid-cols-[1.5fr_1fr] sm:gap-4">
						<Label
							class={calculationMode === 'outflow'
								? 'text-primary text-base font-bold'
								: 'text-base'}
						>
							Avgående flöde (q<sub>a</sub>)
						</Label>
						<div class="relative">
							<Input
								type="number"
								bind:value={qa}
								readonly={calculationMode === 'outflow'}
								class="{calculationMode === 'outflow'
									? 'bg-primary/5 border-primary text-foreground ring-primary/20 font-medium'
									: ''} pr-12 transition-all duration-200"
								step="0.1"
							/>
							<span
								class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm select-none"
								>l/s</span
							>
						</div>
					</div>

					<Separator />

					<!-- Buffert Volym (V) -->
					<div class="grid items-center gap-2 sm:grid-cols-[1.5fr_1fr] sm:gap-4">
						<Label
							class={calculationMode === 'volume'
								? 'text-primary text-base font-bold'
								: 'text-base'}
						>
							Buffertvolym (V)
						</Label>
						<div class="relative">
							<Input
								type="number"
								bind:value={V}
								readonly={calculationMode === 'volume'}
								class="{calculationMode === 'volume'
									? 'bg-primary/5 border-primary text-foreground ring-primary/20 text-lg font-bold'
									: ''} pr-12 transition-all duration-200"
								step="1"
							/>
							<span
								class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm select-none"
								>l</span
							>
						</div>
					</div>
				</div>

				<div class="bg-muted/30 flex flex-wrap gap-2 border-t p-4">
					<span class="flex h-9 items-center px-2 text-sm font-medium">Beräkna:</span>
					<div class="flex flex-wrap gap-2">
						<Button
							variant={calculationMode === 'volume' ? 'default' : 'outline'}
							size="sm"
							onclick={() => setMode('volume')}
						>
							Volym
						</Button>
						<Button
							variant={calculationMode === 'inflow' ? 'default' : 'outline'}
							size="sm"
							onclick={() => setMode('inflow')}
						>
							Inkommande Flöde
						</Button>
						<Button
							variant={calculationMode === 'outflow' ? 'default' : 'outline'}
							size="sm"
							onclick={() => setMode('outflow')}
						>
							Avgående Flöde
						</Button>
						<Button
							variant={calculationMode === 'time' ? 'default' : 'outline'}
							size="sm"
							onclick={() => setMode('time')}
						>
							Tid
						</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- Explanations Side Panel -->
		<div class="space-y-6">
			<div class="bg-card rounded-xl border p-6 shadow-sm">
				<h3 class="flex items-center gap-2 font-semibold">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-primary"
						><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
					>
					Förklaringar
				</h3>
				<div class="text-muted-foreground mt-4 space-y-4 text-sm leading-relaxed">
					<p>
						Att mellanlagra eller buffra spillvatten kan vara tillämpligt vid till exempel när man
						har stora och kortare störtflöden av spillvatten och man inte vill eller kan lägga en
						tillräckligt stort rör för att klara dessa fall.
					</p>

					<div class="space-y-1">
						<span class="text-foreground block font-medium">Inkommande flöde (q<sub>t</sub>)</span>
						<p>Är det flöde som fyller på buffertvolymen.</p>
					</div>

					<div class="space-y-1">
						<span class="text-foreground block font-medium">Tömningstid (t<sub>q</sub>)</span>
						<p>
							Den tid som tömningsflödet fyller buffertvolymen dvs under den tid som bufferten fylls
							på.
						</p>
					</div>

					<div class="space-y-1">
						<span class="text-foreground block font-medium">Avgående flöde (q<sub>a</sub>)</span>
						<p>Avser flödet ut ur buffertvolymen och som går vidare ut på systemet.</p>
					</div>

					<div class="space-y-1">
						<span class="text-foreground block font-medium">Buffertvolym (V)</span>
						<p>
							Den volym som man behöver lagra för att man ska klara av de förutsättningar som
							avgivits.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
