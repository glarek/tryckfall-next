// src/components/svelte/pressure-drop/inputStore.js
import fluidSeriesData from './fluidTypes.json';
import pipeSeriesData from './pipe.series.json';
import flowRateSeriesData from './pipe.flow.rate.json';
import powerData from './power.json';

// Initial state for the air properties
export const inputStore = $state({
	// Input values (can have default starting points)
	inletTemperature: 60, // Example default
	outletTemperature: 30, // Example default
	fluidType: fluidSeriesData[0],
	pipeSeries: pipeSeriesData[0],
	concentration: 0,
	flowRateM3s: 0,
	powerW: 2000,
	flowRateSeries: flowRateSeriesData[0],
	powerSeries: powerData[0],
	flowPriority: false,

	ZERO_CELSIUS_KELVIN: 273.15,
	FLUID_PRESSURE: 101325, // Standard atmospheric pressure in Pa
	TRANSITIONLIMIT: 2300,
	TRANSITION_INTERVAL: 500
});

console.log('Fluidseriesdata set to ', inputStore.fluidType);
