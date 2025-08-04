// src/lib/sanity.ts

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

import {
	PUBLIC_SANITY_DATASET,
	PUBLIC_SANITY_PROJECT_ID,
	PUBLIC_SANITY_STUDIO_URL
} from '$env/static/public';

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2025-08-04',
	useCdn: true,
	stega: {
		enabled: true,
		studioUrl: PUBLIC_SANITY_STUDIO_URL
	}
});

const builder = imageUrlBuilder(client);

export function urlFor(source) {
	return builder.image(source);
}
