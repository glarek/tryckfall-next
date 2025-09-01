import { form, command, query, getRequestEvent } from '$app/server';
import { fail, error, redirect } from '@sveltejs/kit';

import { IMAGE_UPLOAD_TOKEN } from '$env/static/private';
import { REVALIDATION_SECRET } from '$env/static/private';
import * as v from 'valibot'; // Vi använder Valibot för validering som rekommenderat [cite: 22]

export const getPosts = query(async () => {
	const event = getRequestEvent();
	if (!event) throw error(500, 'Server error');

	const { supabase } = event.locals;

	let { data: posts, error: dbError } = await supabase
		.from('wiki-pages')
		.select('slug, title, content, category:wiki-categories(title)');

	if (dbError) {
		console.error('Det uppstod ett fel:', dbError);
		throw error(500, 'Kunde inte hämta inlägg.');
	}

	return posts;
});

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

		if (dbError) {
			error(404, 'Inlägget hittades inte');
		}

		return post;
	}
);

export const getCategories = query(async () => {
	const event = getRequestEvent();
	if (!event) throw error(500, 'Could not get request event');

	const { supabase } = event.locals;

	console.log('--- Getting categories ---');

	const { data: categories } = await supabase.from('wiki-categories').select('id, title');

	console.log(categories);

	return { categories };
});

// Ersätter din gamla `load`-funktion
export const getPageDataForEdit = query(
	v.string(), // Validerar att `slug` är en sträng [cite: 26]
	async (slug) => {
		const timeStamp = Date.now();
		const event = getRequestEvent();
		if (!event) throw error(500, 'Could not get request event');

		const { supabase } = event.locals;

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
		return { cleanPages, categories, timeStamp };
	}
);

export const createPost = form(async (formData) => {
	const event = getRequestEvent();
	if (!event) throw error(500, 'Could not get request event');
	const { supabase } = event.locals;

	const content = formData.get('content');
	const title = formData.get('title');
	const slug = formData.get('slug');
	const category_id = Number(formData.get('category'));

	if (!slug) return fail(400, { message: 'Slug får inte vara tom.' });

	const { error: createError } = await supabase
		.from('wiki-pages')
		.insert({ content, title, slug, category_id });

	if (createError) {
		return fail(500, { message: createError.message });
	}

	try {
		const revalidationPromises = [
			event.fetch(`/wiki/`, {
				method: 'HEAD',
				headers: { 'x-prerender-revalidate': `${REVALIDATION_SECRET}` }
			})
		];

		// Vänta på att BÅDA anropen slutförs parallellt
		await Promise.all(revalidationPromises);

		console.log('Revalidation complete for both endpoints.');
	} catch (e) {
		console.warn('Could not revalidate wiki pages:', e);
	}

	console.log('Redirectar dig');
	throw redirect(303, `/wiki/${slug}`);
});

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

	if (!slug) return fail(400, { message: 'Slug får inte vara tom.' });

	const { error: updateError } = await supabase
		.from('wiki-pages')
		.update({ content, title, slug, category_id })
		.eq('slug', originalSlug);

	if (updateError) {
		return fail(500, { message: updateError.message });
	}

	// Omdirigera till den uppdaterade sidan med cache-busting
	// GET request to the updated slug page (optional, e.g. for cache-busting or preloading)

	try {
		const revalidationPromises = [
			event.fetch(`/wiki/${slug}`, {
				method: 'HEAD',
				headers: { 'x-prerender-revalidate': `${REVALIDATION_SECRET}` }
			}),
			event.fetch(`/wiki/`, {
				method: 'HEAD',
				headers: { 'x-prerender-revalidate': `${REVALIDATION_SECRET}` }
			})
		];

		// Vänta på att BÅDA anropen slutförs parallellt
		await Promise.all(revalidationPromises);

		console.log('Revalidation complete for both endpoints.');
	} catch (e) {
		console.warn('Could not revalidate wiki pages:', e);
	}

	console.log('Redirectar dig');
	throw redirect(303, `/wiki/${slug}`);

	//Only use if you want to enable an "always on" preview of the page with the cookie
	//event.cookies.set('__prerender_bypass', REVALIDATION_SECRET, { path: '/' });
});

// Ersätter `actions.delete`
export const deletePost = form(async (formData) => {
	const event = getRequestEvent();
	if (!event) throw error(500, 'Could not get request event');
	const { supabase } = event.locals;
	const slug = formData.get('originalSlug');

	const { error: deleteError } = await supabase.from('wiki-pages').delete().eq('slug', slug);
	if (deleteError) return fail(500, { message: deleteError.message });

	try {
		const revalidationPromises = [
			event.fetch(`/wiki/`, {
				method: 'HEAD',
				headers: { 'x-prerender-revalidate': `${REVALIDATION_SECRET}` }
			})
		];

		// Vänta på att BÅDA anropen slutförs parallellt
		await Promise.all(revalidationPromises);

		console.log('Revalidation complete for both endpoints.');
	} catch (e) {
		console.warn('Could not revalidate wiki pages:', e);
	}

	console.log('Redirectar dig');
	throw redirect(303, `/wiki/`);
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
