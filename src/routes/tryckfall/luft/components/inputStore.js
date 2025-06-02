// src/components/svelte/pressure-drop/inputStore.js
import { writable } from 'svelte/store'

// Initial state for the air properties
const initialState = {
    // Input values (can have default starting points)
    inletTemperature: 18, // Example default
    outletTemperature: 24, // Example default
    relativeHumidity: 50, // Example default
}

// Create the writable store
export const inputStore = writable(initialState)
