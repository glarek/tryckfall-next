<script>
	// prettier-ignore
	import { onMount } from 'svelte'
	import { inputStore } from './inputStore.svelte.js'; // Import the store
	import { airPropertiesStore } from './airPropertiesStore.js'; // Import the store
	import { base } from '$app/paths';

	// --- Constants ---
	const ZERO_CELSIUS_KELVIN = 273.15;
	const AIR_PRESSURE = 101325; // Standard atmospheric pressure in Pa

	let coolPropModule = null; // To hold the loaded CoolProp Module
	let isCoolPropReady = false;
	let assignedRuntimeInitializedCallback = null; // Store the function we assign for cleanup

	function calculateAirProperties() {
		// Read input values directly from the store
		if (!isCoolPropReady || !coolPropModule) {
			console.log('CoolProp effect skipped: Module not ready.');
			return; // Don't run if CoolProp isn't loaded
		}

		try {
			const avgTempC = (inputStore.inletTemperature + inputStore.outletTemperature) / 2;
			const avgTempK = avgTempC + ZERO_CELSIUS_KELVIN;

			// Calculate properties using HAPropsSI and PropsSI
			const H = coolPropModule.HAPropsSI(
				'H',
				'T',
				avgTempK,
				'P',
				AIR_PRESSURE,
				'R',
				inputStore.relativeHumidity / 100
			);
			const Cp = coolPropModule.HAPropsSI(
				'cp_ha',
				'T',
				avgTempK,
				'P',
				AIR_PRESSURE,
				'R',
				inputStore.relativeHumidity / 100
			);
			const Tdp =
				coolPropModule.HAPropsSI(
					'Tdp',
					'T',
					avgTempK,
					'P',
					AIR_PRESSURE,
					'R',
					inputStore.relativeHumidity / 100
				) - ZERO_CELSIUS_KELVIN; // K to C
			const Twb =
				coolPropModule.HAPropsSI(
					'Twb',
					'T',
					avgTempK,
					'P',
					AIR_PRESSURE,
					'R',
					inputStore.relativeHumidity / 100
				) - ZERO_CELSIUS_KELVIN; // K to C
			const D = coolPropModule.PropsSI('D', 'T', avgTempK, 'P', AIR_PRESSURE, 'Air'); // Density
			const V = coolPropModule.PropsSI('V', 'T', avgTempK, 'P', AIR_PRESSURE, 'Air'); // Dynamic Viscosity
			const kinematicVisc = D > 0 ? V / D : 0;

			// Update the store with calculated values
			airPropertiesStore.update((store) => ({
				...store,
				enthalpy: H,
				specificHeatCapacity: Cp,
				dewPoint: Tdp,
				wetBulb: Twb,
				airDensity: D,
				dynamicViscosity: V,
				kinematicViscosity: kinematicVisc,
				error: null // Clear any previous error
			}));
		} catch (error) {
			console.error('Error during CoolProp calculation:', error);
			// Update store with error state and potentially reset outputs
			airPropertiesStore.update((store) => ({
				...store,
				error: error.message || 'Calculation failed'
			}));
		}
	}

	// --- CoolProp Initialization ---
	onMount(() => {
		// Indicate loading state in the store
		airPropertiesStore.update((store) => ({ ...store, isLoading: true, error: null }));

		const checkCoolProp = () => {
			// Checks if 'Module' exists and is ready
			if (typeof Module !== 'undefined' && Module.calledRun) {
				console.log('CoolProp module already initialized.');
				coolPropModule = Module; // Assigns the global Module to a local variable
				isCoolPropReady = true;
				airPropertiesStore.update((store) => ({ ...store, isLoading: false }));
				calculateAirProperties();
			} else if (typeof Module !== 'undefined' && Module.onRuntimeInitialized) {
				// Define the callback function separately for cleanup
				assignedRuntimeInitializedCallback = () => {
					console.log('CoolProp runtime initialized.');
					coolPropModule = Module;
					isCoolPropReady = true;
					airPropertiesStore.update((store) => ({ ...store, isLoading: false }));
					calculateAirProperties();
					assignedRuntimeInitializedCallback = null; // Clear reference after execution
				};
			} else {
				console.log('CoolProp Module not ready yet, waiting...');
				setTimeout(checkCoolProp, 150); // Check again shortly
			}
		};

		checkCoolProp();

		// Cleanup
		return () => {
			// Check if the currently assigned callback is the one we stored
			if (
				typeof Module !== 'undefined' &&
				Module.onRuntimeInitialized === assignedRuntimeInitializedCallback
			) {
				Module.onRuntimeInitialized = null;
			}
		};
	});

	// --- Reactive Effect for Calculations ---
	// Use $effect.pre to ensure inputs are stable before calculating
	$effect.pre(() => {
		// Read input values directly from the store
		const _dependencies = [
			inputStore.inletTemperature,
			inputStore.outletTemperature,
			inputStore.relativeHumidity
		];
		calculateAirProperties(); // Call the calculation function
	});
</script>

<svelte:head>
	<script src="{base}/coolprop.js"></script>
</svelte:head>
