import { auth } from '$lib/stores/auth.svelte';
import { browser } from '$app/environment';

export const ssr = false; // Disable SSR for the whole app as it's an SPA

export const load = async () => {
	if (browser) {
		auth.initialize();
	}
	return {};
};
