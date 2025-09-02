<script lang="ts">
	import { onMount } from 'svelte';
	import { loadCoolProp } from '$lib/coolprop.js'; // Importera vår robusta laddare

	// Importera dina stores. Ändelsen .svelte.js är oftast inte nödvändig.
	import { inputStore } from './inputStore.svelte.js';
	import { fluidPropertiesStore } from './fluidPropertiesStore.svelte.js';

	let coolPropModule: any = null;
	let isCoolPropReady = $state(false);

	// --- CoolProp Initialization ---
	onMount(async () => {
		fluidPropertiesStore.isLoading = true;
		fluidPropertiesStore.error = null;

		try {
			// Anropa laddaren och invänta att modulen är redo. Inga race conditions!
			coolPropModule = await loadCoolProp();
			isCoolPropReady = true;
		} catch (error: any) {
			console.error(error);
			fluidPropertiesStore.error = error.message;
		} finally {
			fluidPropertiesStore.isLoading = false;
		}
	});

	// --- Reactive Effect for Calculations ---
	$effect(() => {
		// Läs av alla värden från storen i början av effekten.
		// Detta säkerställer att effekten körs om när något av dem ändras.
		const {
			fluidType,
			concentration,
			inletTemperature,
			outletTemperature,
			surroundingTemperature,
			logMeanT,
			FLUID_PRESSURE,
			ZERO_CELSIUS_KELVIN
		} = inputStore;

		// Kör inga beräkningar om modulen inte är redo
		if (!isCoolPropReady) {
			console.log('CoolProp effect skipped: Module not ready.');
			return;
		}

		let fluidTypeInputValue: string;
		if (fluidType.value === 'Water' || concentration === 0) {
			fluidTypeInputValue = 'Water';
		} else {
			fluidTypeInputValue = `INCOMP::${fluidType.value}[${concentration}]`;
		}

		try {
			let avgTempK: number;
			if (logMeanT) {
				const T_hot_in = inletTemperature + ZERO_CELSIUS_KELVIN;
				const T_cold_in = surroundingTemperature + ZERO_CELSIUS_KELVIN;
				const T_hot_out = outletTemperature + ZERO_CELSIUS_KELVIN;
				const T_cold_out = surroundingTemperature + ZERO_CELSIUS_KELVIN;
				const deltaT1 = T_hot_in - T_cold_in;
				const deltaT2 = T_hot_out - T_cold_out;
				avgTempK = (deltaT1 - deltaT2) / Math.log(deltaT1 / deltaT2) + T_cold_in;
			} else {
				avgTempK = (inletTemperature + outletTemperature) / 2 + ZERO_CELSIUS_KELVIN;
			}

			// Beräkna egenskaper
			const H = coolPropModule.PropsSI(
				'H',
				'T',
				avgTempK,
				'P',
				FLUID_PRESSURE,
				fluidTypeInputValue
			);
			const Cp = coolPropModule.PropsSI(
				'C',
				'T',
				avgTempK,
				'P',
				FLUID_PRESSURE,
				fluidTypeInputValue
			);
			const D = coolPropModule.PropsSI(
				'D',
				'T',
				avgTempK,
				'P',
				FLUID_PRESSURE,
				fluidTypeInputValue
			);
			const V = coolPropModule.PropsSI(
				'V',
				'T',
				avgTempK,
				'P',
				FLUID_PRESSURE,
				fluidTypeInputValue
			);
			const kinematicVisc = D > 0 ? V / D : 0;
			const freezeT =
				fluidTypeInputValue === 'Water'
					? ZERO_CELSIUS_KELVIN
					: (coolPropModule.PropsSI(
							'T_freeze',
							'T',
							avgTempK,
							'P',
							FLUID_PRESSURE,
							fluidTypeInputValue
						) ?? 0);
			const maxT =
				fluidTypeInputValue === 'Water'
					? 100 + ZERO_CELSIUS_KELVIN
					: (coolPropModule.PropsSI(
							'T_max',
							'T',
							avgTempK,
							'P',
							FLUID_PRESSURE,
							fluidTypeInputValue
						) ?? 0);

			// Uppdatera store med beräknade värden
			fluidPropertiesStore.enthalpy = H;
			fluidPropertiesStore.specificHeatCapacity = Cp;
			fluidPropertiesStore.density = D;
			fluidPropertiesStore.dynamicViscosity = V;
			fluidPropertiesStore.kinematicViscosity = kinematicVisc;
			fluidPropertiesStore.error = null;
			fluidPropertiesStore.freezeT = freezeT - ZERO_CELSIUS_KELVIN;
			fluidPropertiesStore.maxT = maxT - ZERO_CELSIUS_KELVIN;
			fluidPropertiesStore.calcTemp = avgTempK - ZERO_CELSIUS_KELVIN;
		} catch (error: any) {
			console.error('Error during CoolProp calculation:', error);
			fluidPropertiesStore.error = error.message || 'Calculation failed';
		}
	});
</script>
