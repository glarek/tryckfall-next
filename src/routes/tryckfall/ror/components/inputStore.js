// src/components/svelte/pressure-drop/inputStore.js
import { writable } from 'svelte/store';
import fluidSeriesData from './fluidTypes.json';

// Initial state for the air properties
const initialState = {
	// Input values (can have default starting points)
	inletTemperature: 60, // Example default
	outletTemperature: 30, // Example default
	fluidType: fluidSeriesData[0],
	concentration: 0
};

console.log('Fluidseriesdata set to ', initialState.fluidType);

// Create the writable store
export const inputStore = writable(initialState);
