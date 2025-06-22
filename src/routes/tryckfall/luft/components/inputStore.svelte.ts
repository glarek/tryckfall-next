// src/components/svelte/pressure-drop/inputStore.js
import flowRateSeriesData from './duct.flow.rate.json';
import powerData from './power.json';
import ductSeriesData from './duct.series.json';

// Initial state for the air properties
export const inputStore = $state({
	// Input values (can have default starting points)
	inletTemperature: 18, // Example default
	outletTemperature: 24, // Example default
	relativeHumidity: 50, // Example default
	flowRateSeries: flowRateSeriesData[0],
	powerSeries: powerData[0],
	ductSeries: ductSeriesData[0],
	flowRateM3s: 0.02 as number | null,
	powerW: 0 as number | null,
	flowPriority: true, // Flow rate priority for calculations

	TRANSITIONLIMIT: 2300,
	TRANSITION_INTERVAL: 500
});
