// src/components/svelte/pressure-drop/inputStore.js
import { writable } from 'svelte/store';

// Initial state for the air properties
const initialState = {
	// Input values (can have default starting points)
	inletTemperature: 60, // Example default
	outletTemperature: 30, // Example default
	fluidType: 'Water'
};

// Create the writable store
export const inputStore = writable(initialState);
