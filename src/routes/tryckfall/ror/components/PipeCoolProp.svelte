<script>
	// prettier-ignore
	import { onMount } from 'svelte'
	import { inputStore } from './inputStore.svelte.js'; // Import the store
	import { fluidPropertiesStore } from './fluidPropertiesStore.svelte.js'; // Import the store
	import { base } from '$app/paths';

	let coolPropModule = null; // To hold the loaded CoolProp Module
	let isCoolPropReady = false;
	let assignedRuntimeInitializedCallback = null; // Store the function we assign for cleanup

	function calculateAirProperties() {
		// Read input values directly from the store
		if (!isCoolPropReady || !coolPropModule) {
			console.log('CoolProp effect skipped: Module not ready.');
			return; // Don't run if CoolProp isn't loaded
		}

		let fluidTypeInputValue;

		if (inputStore.fluidType.value === 'Water' || inputStore.concentration === 0) {
			fluidTypeInputValue = 'Water';
		} else {
			fluidTypeInputValue =
				'INCOMP::' + inputStore.fluidType.value + '[' + inputStore.concentration + ']';
		}

		console.log(fluidTypeInputValue);

		try {
			const avgTempC = (inputStore.inletTemperature + inputStore.outletTemperature) / 2;
			const avgTempK = avgTempC + inputStore.ZERO_CELSIUS_KELVIN;

			// Calculate properties using HAPropsSI and PropsSI
			const H = coolPropModule.PropsSI(
				'H',
				'T',
				avgTempK,
				'P',
				inputStore.FLUID_PRESSURE,
				fluidTypeInputValue
			);
			const Cp = coolPropModule.PropsSI(
				'C',
				'T',
				avgTempK,
				'P',
				inputStore.FLUID_PRESSURE,
				fluidTypeInputValue
			);
			const D = coolPropModule.PropsSI(
				'D',
				'T',
				avgTempK,
				'P',
				inputStore.FLUID_PRESSURE,
				fluidTypeInputValue
			); // Density
			const V = coolPropModule.PropsSI(
				'V',
				'T',
				avgTempK,
				'P',
				inputStore.FLUID_PRESSURE,
				fluidTypeInputValue
			); // Dynamic Viscosity
			const kinematicVisc = D > 0 ? V / D : 0;

			const freezeT =
				fluidTypeInputValue === 'Water'
					? inputStore.ZERO_CELSIUS_KELVIN
					: (coolPropModule.PropsSI(
							'T_freeze',
							'T',
							avgTempK,
							'P',
							inputStore.FLUID_PRESSURE,
							fluidTypeInputValue
						) ?? 0);

			const maxT =
				fluidTypeInputValue === 'Water'
					? 100 + inputStore.ZERO_CELSIUS_KELVIN
					: (coolPropModule.PropsSI(
							'T_max',
							'T',
							avgTempK,
							'P',
							inputStore.FLUID_PRESSURE,
							fluidTypeInputValue
						) ?? 0);

			// Update the store with calculated values
			fluidPropertiesStore.enthalpy = H;
			fluidPropertiesStore.specificHeatCapacity = Cp;
			fluidPropertiesStore.density = D;
			fluidPropertiesStore.dynamicViscosity = V;
			fluidPropertiesStore.kinematicViscosity = kinematicVisc;
			fluidPropertiesStore.error = null; // Clear any previous error
			fluidPropertiesStore.freezeT = freezeT - inputStore.ZERO_CELSIUS_KELVIN;
			fluidPropertiesStore.maxT = maxT - inputStore.ZERO_CELSIUS_KELVIN;
		} catch (error) {
			console.error('Error during CoolProp calculation:', error);
			// Update store with error state and potentially reset outputs
			fluidPropertiesStore.error = error.message || 'Calculation failed';
		}
	}

	// --- CoolProp Initialization ---
	onMount(() => {
		// Indicate loading state in the store
		fluidPropertiesStore.isLoading = true;
		fluidPropertiesStore.error = null;

		const checkCoolProp = () => {
			// Checks if 'Module' exists and is ready
			if (typeof Module !== 'undefined' && Module.calledRun) {
				console.log('CoolProp module already initialized.');
				coolPropModule = Module; // Assigns the global Module to a local variable
				isCoolPropReady = true;
				fluidPropertiesStore.isLoading = false;
				calculateAirProperties();
			} else if (typeof Module !== 'undefined' && Module.onRuntimeInitialized) {
				// Define the callback function separately for cleanup
				assignedRuntimeInitializedCallback = () => {
					console.log('CoolProp runtime initialized.');
					coolPropModule = Module;
					isCoolPropReady = true;
					fluidPropertiesStore.isLoading = false;
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
		const _dependencies = [
			inputStore.fluidType.value,
			inputStore.concentration,
			inputStore.inletTemperature,
			inputStore.outletTemperature
		];

		calculateAirProperties();
	});
</script>

<svelte:head>
	<script src="{base}/coolprop.js"></script>
</svelte:head>
