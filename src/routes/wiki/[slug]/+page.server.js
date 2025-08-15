import { REVALIDATION_SECRET } from '$env/static/private';
import { getPost } from '../wiki.remote';

export const config = {
	isr: {
		expiration: false,
		bypassToken: REVALIDATION_SECRET
	}
};

export const load = async (event) => {
	const slug = event.params.slug;
	console.log('------------Slug är', slug, '------------');
	const post = await getPost(slug);

	console.log('Post data:', post);

	return {
		post,
		slug
	};
};
