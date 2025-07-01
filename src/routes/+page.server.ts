import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: colors } = await supabase.from('colors').select('name').limit(500).order('name');
	return { colors: colors ?? [] };
};
