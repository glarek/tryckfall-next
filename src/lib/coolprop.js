// src/lib/coolprop.js
import { browser } from '$app/environment';
import { base } from '$app/paths';

let coolPropPromise = null;

export function loadCoolProp() {
	if (!browser) {
		return Promise.reject(new Error('CoolProp can only be loaded in the browser.'));
	}

	if (coolPropPromise) {
		return coolPropPromise;
	}

	// Vi använder en asynkron IIFE (Immediately Invoked Function Expression)
	// för att kunna använda await inuti promiset.
	coolPropPromise = (async () => {
		try {
			// Dynamisk import av ES-modulen.
			// `/* @vite-ignore */` är viktigt här för att tala om för Vite att inte
			// försöka analysera denna import vid build-time.
			const coolPropFactory = (await import(/* @vite-ignore */ `${base}/coolprop.js`)).default;

			// Moderna Emscripten-moduler exporterar en "factory"-funktion som
			// returnerar en promise som löses med den färdiga modulen.
			console.log('CoolProp factory loaded, initializing...');
			const moduleInstance = await coolPropFactory();
			console.log('CoolProp module initialized!');

			return moduleInstance;
		} catch (err) {
			console.error('Failed to load or initialize CoolProp module:', err);
			throw err; // Kasta felet vidare
		}
	})();

	return coolPropPromise;
}
