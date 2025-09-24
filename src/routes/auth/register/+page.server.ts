import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/schemas';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	// Skapa ett tomt, validerat formulär-objekt på serversidan
	const form = await superValidate(zod4(registerSchema));
	return { form };
};

export const actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(registerSchema));

		// Superforms kollar om datan är giltig
		if (!form.valid) {
			// Om inte, returnera ett fel med status 400 och formulärdatan
			console.log('Ogiltig data:', form);
			return fail(400, { form });
		}

		const { email, password, firstName, lastName } = form.data;
		console.log(typeof form.data);

		const { data, error } = await supabase.auth.signUp({
			email: email as string,
			password: password as string,
			options: { data: { firstName, lastName } }
		});
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		}

		// Datan är giltig! Här kan du skapa användaren i databasen
		console.log('Användare skapad:', data.user.email);

		// Returnera formuläret för att visa ett success-meddelande
		redirect(303, '/auth/success');
	}
};
