// src/components/svelte/pressure-drop/fluidPropertiesStore.js
import { writable } from 'svelte/store';

// Initial state for the air properties
const initialState = {
	// Calculated values (initialized to null or 0)
	enthalpy: 0,
	specificHeatCapacity: 0,
	dynamicViscosity: 0,
	kinematicViscosity: 0,
	density: 0,

	// Status indicators
	isLoading: true, // Start in loading state until CoolProp is ready
	error: null // No error initially
};

// Create the writable store
export const fluidPropertiesStore = writable(initialState);
