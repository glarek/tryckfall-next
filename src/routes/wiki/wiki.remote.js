import { form, command, query, getRequestEvent } from '$app/server';
import { fail, error, redirect } from '@sveltejs/kit';

import { IMAGE_UPLOAD_TOKEN } from '$env/static/private';
import { REVALIDATION_SECRET } from '$env/static/private';
import * as v from 'valibot'; // Vi använder Valibot för validering som rekommenderat [cite: 22]

export const getPost = query(
	v.string(), // Validerar att `slug` är en sträng
	async (slug) => {
		const event = getRequestEvent();
		if (!event) throw error(500, 'Server error');

		const { supabase } = event.locals;

		let { data: post, error: dbError } = await supabase
			.from('wiki-pages')
			.select('slug, title, content, category:wiki-categories(title)')
			.eq('slug', slug)
			.single();

		post = { ...post, category: post.category?.title };

		console.log(post);

		if (dbError) {
			error(404, 'Inlägget hittades inte');
		}

		return post;
	}
);

// Ersätter din gamla `load`-funktion
export const getPageDataForEdit = query(
	v.string(), // Validerar att `slug` är en sträng [cite: 26]
	async (slug) => {
		const event = getRequestEvent();
		if (!event) throw error(500, 'Could not get request event');

		const { supabase } = event.locals;

		console.log('--- Remote query running ---');

		const { data: role } = await supabase.rpc('get_user_role');
		if (role !== 'admin') {
			redirect(303, '/auth');
		}

		const { data: categories } = await supabase.from('wiki-categories').select('id, title');
		const { data, error: pageError } = await supabase
			.from('wiki-pages')
			.select('slug, title, content, category:wiki-categories(id)')
			.eq('slug', slug)
			.single();

		if (pageError) {
			error(404, 'Not found');
		}

		const cleanPages = { ...data, category: data.category?.id || 'Okategoriserad' };
		return { cleanPages, categories };
	}
);

// Ersätter `actions.update`
export const updatePost = form(async (formData) => {
	const event = getRequestEvent();

	if (!event) throw error(500, 'Could not get request event');
	const { supabase } = event.locals;

	const content = formData.get('content');
	const title = formData.get('title');
	const slug = formData.get('slug');
	const category_id = Number(formData.get('category'));
	const originalSlug = formData.get('originalSlug'); // Vi måste få ursprunglig slug på annat sätt

	console.log(event.url.searchParams);
	console.log('originalSlug:', originalSlug);

	if (!slug) return fail(400, { message: 'Slug får inte vara tom.' });

	const { error: updateError } = await supabase
		.from('wiki-pages')
		.update({ content, title, slug, category_id })
		.eq('slug', originalSlug);

	if (updateError) {
		console.log(updateError);
		return fail(500, { message: updateError.message });
	}

	// Omdirigera till den uppdaterade sidan med cache-busting
	// GET request to the updated slug page (optional, e.g. for cache-busting or preloading)

	try {
		await event.fetch(`/wiki/${slug}`, {
			method: 'HEAD',
			headers: {
				'x-prerender-revalidate': `${REVALIDATION_SECRET}`
			}
		});
	} catch (e) {
		console.warn('Could not prefetch updated wiki page:', e);
	}
	event.cookies.set('__prerender_bypass', REVALIDATION_SECRET, { path: '/' });
	redirect(303, `/wiki/${slug}`);
});

// Ersätter `actions.delete`
export const deletePost = form(async () => {
	const event = getRequestEvent();
	if (!event) throw error(500, 'Could not get request event');
	const { supabase } = event.locals;
	const slug = event.url.searchParams.get('slug');

	const { error: deleteError } = await supabase.from('wiki-pages').delete().eq('slug', slug);
	if (deleteError) return fail(500, { message: deleteError.message });

	redirect(303, '/wiki');
});

// Ersätter `actions.imageUpload`
export const uploadImage = command(async (formData) => {
	// Din befintliga imageUpload-logik kan klistras in här nästan rakt av.
	const file = formData.get('image');
	if (!file || typeof file === 'string' || file.size === 0) {
		error(400, 'Ingen fil valdes för uppladdning.');
	}

	const apiFormData = new FormData();
	apiFormData.append('token', IMAGE_UPLOAD_TOKEN);
	apiFormData.append('image', file);

	try {
		const response = await fetch('https://admin.tryckfall.nu/upload.php', {
			method: 'POST',
			body: apiFormData
		});
		const result = await response.json();
		if (!response.ok || !result.success) {
			error(500, result.error || 'Servern svarade med ett fel.');
		}
		return result; // Returnera resultatet till klienten
	} catch {
		error(500, 'Kunde inte nå uppladdningstjänsten.');
	}
});
