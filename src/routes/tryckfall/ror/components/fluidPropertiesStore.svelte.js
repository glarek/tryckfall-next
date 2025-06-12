// src/routes/tryckfall/ror/components/fluidPropertiesStore.js
// (eller var den nu ligger)

// Initial state for fluid properties
export const fluidPropertiesStore = $state({
	enthalpy: 0,
	specificHeatCapacity: 0,
	density: 1000, // Sätt lämpliga defaultvärden
	dynamicViscosity: 0,
	kinematicViscosity: 0,
	isLoading: true,
	error: null,
	freezeT: 0,
	maxT: 100
});
