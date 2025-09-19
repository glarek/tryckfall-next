import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: profile } = await supabase.from('profiles').select('first_name, last_name');
	console.log('Användare är', profile);
	return { profile: profile[0] ?? {} };
};
