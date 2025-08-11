import { json } from '@sveltejs/kit';

export async function GET({ locals: { supabase } }) {
	// Call the Supabase remote procedure and destructure its response
	const { data: role, error } = await supabase.rpc('get_user_role');

	// 1. Handle potential errors from the database call
	if (error) {
		console.error('Error fetching user role:', error);
		// Return a standard error response
		return json({ error: 'Could not verify user role' }, { status: 500 });
	}

	// 2. Determine if the user is an admin
	const isUserAdmin = role === 'admin';

	// 3. Return a proper JSON response
	return json({ isUserAdmin });
}
