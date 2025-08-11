export const config = {
	isr: {
		// Revalidate every 60 seconds
		expiration: 60,
		bypassToken: '153167d1-87cf-407f-8ee5-243d292ef3e8'
	}
};

export async function load({ params, locals: { supabase } }) {
	console.log('--- Page load function running ---');

	const { data: categories } = await supabase.from('wiki-categories').select('id, title');

	const { data, error } = await supabase
		.from('wiki-pages')
		.select(
			`
			slug,
			title,
			content,
			category:wiki-categories ( id )
		`
		)
		.eq('slug', params.slug)
		.single();

	if (error) {
		console.error('Fel vid hämtning av data:', error);
		return;
	}

	// Steg 2: Transformera datan för att "platta till" kategorin
	const cleanPages = { ...data, category: data.category?.id || 'Okategoriserad' };

	return { cleanPages, categories };
}
