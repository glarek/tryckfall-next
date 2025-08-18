import { REVALIDATION_SECRET } from '$env/static/private';
import { getPosts } from './wiki.remote';
import { error as svelteError } from '@sveltejs/kit';

export const config = {
	isr: {
		expiration: 60000,
		bypassToken: REVALIDATION_SECRET,
		allowQuery: ['search']
	}
};

export const load = async () => {
	const posts = await getPosts();

	// 2. Gruppera sidorna efter kategori med reduce
	const groupedByTitle = posts.reduce((acc, page) => {
		// Hämta kategorins titel. Använd en fallback om en sida saknar kategori.
		const categoryTitle = page.category?.title || 'Okategoriserad';

		// Om kategorin inte redan finns i vårt ackumulator-objekt, skapa den.
		if (!acc[categoryTitle]) {
			acc[categoryTitle] = [];
		}

		// Lägg till sidan (endast slug och title) i rätt kategori-array.
		acc[categoryTitle].push({ slug: page.slug, title: page.title });

		return acc;
	}, {}); // Starta med ett tomt objekt

	// 3. (Valfritt men rekommenderat) Omvandla objektet till en array för enklare hantering i Svelte
	const groupedPages = Object.entries(groupedByTitle).map(([title, pages]) => ({
		categoryTitle: title,
		pages: pages
	}));

	// Sortera kategorierna i bokstavsordning
	groupedPages.sort((a, b) => a.categoryTitle.localeCompare(b.categoryTitle));

	// 4. Returnera den färdig-grupperade datan
	return { groupedPages };
};
