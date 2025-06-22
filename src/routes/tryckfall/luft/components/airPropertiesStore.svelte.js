// Initial state for the air properties
export const airPropertiesStore = $state({
	// Calculated values (initialized to null or 0)
	enthalpy: 0,
	specificHeatCapacity: 0,
	dewPoint: 0,
	wetBulb: 0,
	airDensity: 0,
	dynamicViscosity: 0,
	kinematicViscosity: 0,

	// Status indicators
	isLoading: true, // Start in loading state until CoolProp is ready
	error: null // No error initially
});
