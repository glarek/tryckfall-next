<script>
	// prettier-ignore
	import { onMount } from 'svelte'
	import { inputStore } from './inputStore.js'; // Import the store
	import { fluidPropertiesStore } from './fluidPropertiesStore.js'; // Import the store
	import { base } from '$app/paths';

	// --- Constants ---
	const ZERO_CELSIUS_KELVIN = 273.15;
	const FLUID_PRESSURE = 101325; // Standard atmospheric pressure in Pa

	let coolPropModule = null; // To hold the loaded CoolProp Module
	let isCoolPropReady = false;
	let assignedRuntimeInitializedCallback = null; // Store the function we assign for cleanup

	function calculateAirProperties() {
		// Read input values directly from the store
		if (!isCoolPropReady || !coolPropModule) {
			console.log('CoolProp effect skipped: Module not ready.');
			return; // Don't run if CoolProp isn't loaded
		}

		const { inletTemperature, outletTemperature, fluidType, concentration } = $inputStore; // Use the store directly
		let fluidTypeInputValue;

		if (fluidType.value === 'Water' || concentration === 0) {
			fluidTypeInputValue = 'Water';
		} else {
			fluidTypeInputValue = 'INCOMP::' + fluidType.value + '[' + concentration + ']';
		}

		console.log(fluidTypeInputValue);

		try {
			const avgTempC = (inletTemperature + outletTemperature) / 2;
			const avgTempK = avgTempC + ZERO_CELSIUS_KELVIN;

			// Calculate properties using HAPropsSI and PropsSI
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
			); // Density
			const V = coolPropModule.PropsSI(
				'V',
				'T',
				avgTempK,
				'P',
				FLUID_PRESSURE,
				fluidTypeInputValue
			); // Dynamic Viscosity
			const kinematicVisc = D > 0 ? V / D : 0;

			// Update the store with calculated values
			fluidPropertiesStore.update((store) => ({
				...store,
				enthalpy: H,
				specificHeatCapacity: Cp,
				density: D,
				dynamicViscosity: V,
				kinematicViscosity: kinematicVisc,
				error: null // Clear any previous error
			}));
		} catch (error) {
			console.error('Error during CoolProp calculation:', error);
			// Update store with error state and potentially reset outputs
			fluidPropertiesStore.update((store) => ({
				...store,
				error: error.message || 'Calculation failed'
			}));
		}
	}

	// --- CoolProp Initialization ---
	onMount(() => {
		// Indicate loading state in the store
		fluidPropertiesStore.update((store) => ({ ...store, isLoading: true, error: null }));

		const checkCoolProp = () => {
			// Checks if 'Module' exists and is ready
			if (typeof Module !== 'undefined' && Module.calledRun) {
				console.log('CoolProp module already initialized.');
				coolPropModule = Module; // Assigns the global Module to a local variable
				isCoolPropReady = true;
				fluidPropertiesStore.update((store) => ({ ...store, isLoading: false }));
				calculateAirProperties();
			} else if (typeof Module !== 'undefined' && Module.onRuntimeInitialized) {
				// Define the callback function separately for cleanup
				assignedRuntimeInitializedCallback = () => {
					console.log('CoolProp runtime initialized.');
					coolPropModule = Module;
					isCoolPropReady = true;
					fluidPropertiesStore.update((store) => ({ ...store, isLoading: false }));
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
		const { inletTemperature, outletTemperature, fluidType } = $inputStore; // Use the store directly
		calculateAirProperties(); // Call the calculation function
	});
</script>

<svelte:head>
	<script src="{base}/coolprop.js"></script>
</svelte:head>
