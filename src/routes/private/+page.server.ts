import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: profile } = await supabase.from('profiles').select('first_name, last_name');
	return { profile: profile[0] ?? {} };
};

export const actions = {
	getUsers: async ({ locals: { supabase } }) => {
		const { data } = await supabase.from('profiles').select('*');
		//const { data } = await supabase.from('profiles').select('*').range(0,4);
		console.log('hämtade användare är', data);
		return { profiles: data };
	},

	// ---> LÄGG TILL DENNA NYA ACTION <---
	testAction: async () => {
		console.log('--- TEST ACTION KÖRS ---');
		const testData = {
			message: 'Hej från test action!',
			timestamp: Date.now()
		};
		console.log('--- RETURNERAR:', testData);
		return { testData }; // Returnerar ett objekt med en nyckel 'testData'
	}
};
