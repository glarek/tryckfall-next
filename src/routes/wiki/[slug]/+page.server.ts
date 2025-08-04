// src/routes/blogg/[slug]/+page.server.ts
import { client } from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    publishedAt,
    mainImage,
    body[]{..., _type == "image" => { asset-> }
    }
}`;
	const post = await client.fetch(query, { slug: params.slug });

	if (post) {
		return {
			post
		};
	}

	// Hantera 404 här om du vill
	return {
		status: 404,
		body: new Error('Not Found')
	};
};
