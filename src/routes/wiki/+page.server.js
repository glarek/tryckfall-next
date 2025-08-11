// src/routes/+page.server.js (eller motsvarande)

export async function load({ locals: { supabase } }) {
	// 1. Hämta alla sidor och inkludera kategorins namn
	const { data: pagesData, error } = await supabase
		.from('wiki-pages')
		.select('slug, title, category:wiki-categories(title)');

	if (error) {
		console.error('Det uppstod ett fel:', error);
		// Kasta ett fel för att visa SvelteKits inbyggda felsida
		// throw error(500, 'Kunde inte ladda innehållet.');
		return { groupedPages: [] }; // Eller returnera en tom array vid fel
	}

	// 2. Gruppera sidorna efter kategori med reduce
	const groupedByTitle = pagesData.reduce((acc, page) => {
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
}
