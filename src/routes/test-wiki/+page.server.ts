// src/routes/blogg/+page.server.ts
import { client } from '$lib/sanity';
import { error } from '@sveltejs/kit'; // Importera SvelteKits error-funktion
import type { PageServerLoad } from './$types';

// Valfritt men rekommenderat: Definiera en typ för dina inlägg
// Du kan generera dessa typer automatiskt från ditt Sanity-schema med verktyg som "sanity-ts-gen"
type Post = {
	_id: string;
	title: string;
	slug: { current: string };
	publishedAt: string;
};

export const load: PageServerLoad = async () => {
	// Notera: Vi väljer bara de fält vi behöver för listvyn
	const query = `*[_type == "post"]{ _id, title, slug, publishedAt } | order(publishedAt desc)`;

	try {
		const posts: Post[] = await client.fetch(query);

		if (!posts) {
			// Om Sanity-anropet misslyckas eller returnerar null/undefined
			throw error(500, 'Kunde inte hämta inlägg. Försök igen senare.');
		}

		return {
			posts
		};
	} catch (err) {
		// Fånga eventuella nätverksfel eller andra oväntade problem
		console.error(err);
		throw error(500, 'Ett internt fel uppstod.');
	}
};
