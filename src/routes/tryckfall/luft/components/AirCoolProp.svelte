<script lang="ts">
	import { onMount } from 'svelte';
	import { loadCoolProp } from '$lib/coolprop.js'; // Importera vår nya laddare

	import { inputStore } from './inputStore.svelte.js'; // .svelte.js är oftast inte nödvändigt för stores
	import { airPropertiesStore } from './airPropertiesStore.svelte.js';

	// --- Constants ---
	const ZERO_CELSIUS_KELVIN = 273.15;
	const AIR_PRESSURE = 101325; // Standard atmospheric pressure in Pa

	let coolPropModule = null as any;
	let isCoolPropReady = $state(false);

	// --- CoolProp Initialization ---
	onMount(async () => {
		airPropertiesStore.isLoading = true;
		airPropertiesStore.error = null;

		try {
			// Anropa vår laddare och vänta på att den blir klar.
			coolPropModule = await loadCoolProp();
			isCoolPropReady = true;
		} catch (error) {
			console.error(error);
			airPropertiesStore.error = error.message;
		} finally {
			airPropertiesStore.isLoading = false;
		}
	});

	// --- Reactive Effect for Calculations ---
	// Denna $effect kommer nu automatiskt att köras om när isCoolPropReady blir true.
	$effect(() => {
		// Läs av beroendena för att återköra effekten när de ändras
		const { inletTemperature, outletTemperature, relativeHumidity } = inputStore;

		if (!isCoolPropReady) {
			console.log('CoolProp effect skipped: Module not ready.');
			return; // Kör inte om CoolProp inte är laddad
		}

		try {
			const avgTempC = (inletTemperature + outletTemperature) / 2;
			const avgTempK = avgTempC + ZERO_CELSIUS_KELVIN;

			// ... alla dina HAPropsSI och PropsSI-anrop här ...
			const H = coolPropModule.HAPropsSI(
				'H',
				'T',
				avgTempK,
				'P',
				AIR_PRESSURE,
				'R',
				relativeHumidity / 100
			);
			// ... och så vidare ...
			const D = coolPropModule.PropsSI('D', 'T', avgTempK, 'P', AIR_PRESSURE, 'Air');
			const V = coolPropModule.PropsSI('V', 'T', avgTempK, 'P', AIR_PRESSURE, 'Air');
			const kinematicVisc = D > 0 ? V / D : 0;
			const Cp = coolPropModule.HAPropsSI(
				'cp_ha',
				'T',
				avgTempK,
				'P',
				AIR_PRESSURE,
				'R',
				relativeHumidity / 100
			);
			const Tdp =
				coolPropModule.HAPropsSI(
					'Tdp',
					'T',
					avgTempK,
					'P',
					AIR_PRESSURE,
					'R',
					relativeHumidity / 100
				) - ZERO_CELSIUS_KELVIN;
			const Twb =
				coolPropModule.HAPropsSI(
					'Twb',
					'T',
					avgTempK,
					'P',
					AIR_PRESSURE,
					'R',
					relativeHumidity / 100
				) - ZERO_CELSIUS_KELVIN;

			// Uppdatera store
			inputStore.calcTemperature = avgTempC;
			airPropertiesStore.enthalpy = H;
			airPropertiesStore.specificHeatCapacity = Cp;
			airPropertiesStore.dewPoint = Tdp;
			airPropertiesStore.wetBulb = Twb;
			airPropertiesStore.airDensity = D;
			airPropertiesStore.dynamicViscosity = V;
			airPropertiesStore.kinematicViscosity = kinematicVisc;
			airPropertiesStore.error = null;
		} catch (error) {
			console.error('Error during CoolProp calculation:', error);
			airPropertiesStore.error = error.message || 'Calculation failed';
		}
	});
</script>
