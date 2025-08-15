import { REVALIDATION_SECRET } from '$env/static/private';
import { getPost } from '../wiki.remote';

export const config = {
	isr: {
		expiration: 60000,
		bypassToken: REVALIDATION_SECRET
	}
};

export const load = async (event) => {
	const slug = event.params.slug;
	const post = await getPost(slug);
	const now = new Date();
	const time = now
		.toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
		.slice(0, 19)
		.replace('T', ' ');

	console.log('Post data:', post);

	return {
		post,
		time,
		slug
	};
};
