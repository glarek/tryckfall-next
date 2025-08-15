import { REVALIDATION_SECRET } from '$env/static/private';
import { getPost } from '../wiki.remote';
import { error as svelteError } from '@sveltejs/kit';

export const config = {
	isr: {
		expiration: 60000,
		bypassToken: REVALIDATION_SECRET,
		allowQuery: ['search']
	}
};

export const load = async (event) => {
	const slug = event.params.slug;
	const post = await getPost(slug);

	if (!post) {
		throw svelteError(404, 'Sidan hittades inte');
	}

	const now = new Date();
	const time = now
		.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
		.slice(0, 19)
		.replace('T', ' ');

	return {
		post,
		time,
		slug
	};
};
