// src/routes/posts/[slug]/+page.server.js

import { redirect, fail } from '@sveltejs/kit';
import { IMAGE_UPLOAD_TOKEN } from '$env/static/private';

export async function load({ params, locals: { supabase } }) {
	console.log('--- Page load function running ---');

	const { data: role } = await supabase.rpc('get_user_role');

	if (role !== 'admin') {
		console.error('Access denied: User is not an admin.');
		redirect(303, '/auth');
	}

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

export const actions = {
	update: async ({ request, params, locals: { supabase } }) => {
		const formData = await request.formData();
		const content = formData.get('content');
		const title = formData.get('title');
		const slug = formData.get('slug');
		const category_id = Number(formData.get('category'));

		// Validering (bra att ha)
		if (!slug) {
			return fail(400, { error: 'Slug får inte vara tom.' });
		}

		const { error } = await supabase
			.from('wiki-pages')
			.update({ content, title, slug, category_id })
			.eq('slug', params.slug);

		console.log(error);

		if (error) {
			if (error.code === '23505') {
				// Hantera unika begränsningar (t.ex. duplicerade slugs)
				return fail(400, { error: 'Slug redan används av en annan sida.' });
			}
			// Använd fail för att returnera ett felmeddelande och statuskod
			return fail(500, { error: error.message });
		}

		return { success: true, newSlug: slug };
	},

	delete: async ({ params, locals: { supabase } }) => {
		const { error } = await supabase.from('wiki-pages').delete().eq('slug', params.slug);

		if (error) {
			return { error: error.message };
		}
		redirect(303, `/wiki`);
	},

	imageUpload: async ({ request }) => {
		const data = await request.formData();
		const file = data.get('image');

		// Validera att en fil faktiskt skickades med
		if (!file || typeof file === 'string' || file.size === 0) {
			return { success: false, error: 'Ingen fil valdes för uppladdning.' };
		}

		// Skapa ett nytt FormData-objekt för att skicka till PHP-API:et
		const apiFormData = new FormData();
		// Lägg till token och filen. Notera att fältet måste heta 'image'
		// eftersom det är vad PHP-skriptet förväntar sig.
		apiFormData.append('token', IMAGE_UPLOAD_TOKEN);
		apiFormData.append('image', file);

		try {
			// Skicka requesten till ditt PHP-skript

			const response = await fetch('https://admin.tryckfall.nu/upload.php', {
				method: 'POST',
				body: apiFormData
			});

			const result = await response.json();

			// Om PHP-skriptet returnerade ett fel
			if (!response.ok || !result.success) {
				const errorMessage = result.error || `Servern svarade med status: ${response.status}`;
				return { success: false, error: errorMessage };
			}

			// Allt gick bra, returnera URL:en från PHP-skriptet
			const cleanResult = {
				success: result.success,
				message: result.message,
				url: result.url
			};

			// Returnera det nya, rena objektet.
			return cleanResult;
		} catch (error) {
			console.error('Fel vid anrop till bilduppladdnings-API:', error);
			return {
				success: false,
				error: 'Ett nätverksfel uppstod. Kunde inte nå uppladdningstjänsten.'
			};
		}
	}
};
