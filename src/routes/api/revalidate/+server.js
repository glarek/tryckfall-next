import { REVALIDATION_SECRET } from '$env/static/private';
import { json } from '@sveltejs/kit';

/**
 * This API endpoint is called by a Supabase webhook.
 * It securely revalidates a specific page path on Vercel.
 *
 * Example call:
 * GET /api/revalidate?secret=YOUR_SECRET&path=/posts/my-post-slug
 */
export async function GET({ url }) {
	// 1. Check for the secret token
	const secret = url.searchParams.get('secret');
	if (secret !== REVALIDATION_SECRET) {
		return json({ message: 'Invalid secret token' }, { status: 401 });
	}

	// 2. Get the path to revalidate
	const path = url.searchParams.get('path');
	if (!path) {
		return json({ message: 'Path parameter is missing' }, { status: 400 });
	}

	// 3. Create a response with the special Vercel header
	// The SvelteKit adapter for Vercel will see this header
	// and tell Vercel to purge the cache for the specified path.
	const response = new Response(`Revalidating path: ${path}`);
	response.headers.set('x-vercel-revalidate-path', path);

	console.log(`Revalidation request received for path: ${path}`);

	return response;
}
