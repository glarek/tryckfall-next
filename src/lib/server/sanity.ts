// src/lib/server/sanity.ts

import { SANITY_VIEWER_TOKEN } from '$env/static/private';
import { client } from '$lib/sanity';

export const serverClient = client.withConfig({
	token: SANITY_VIEWER_TOKEN
});
