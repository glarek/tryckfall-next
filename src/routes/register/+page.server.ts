import { fail, redirect } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms';

import { superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/schemas';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	// Skapa ett tomt, validerat formulär-objekt på serversidan
	const form = await superValidate(zod4(registerSchema));
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(registerSchema));

		// Superforms kollar om datan är giltig
		if (!form.valid) {
			// Om inte, returnera ett fel med status 400 och formulärdatan
			console.log('Ogiltig data:', form);
			return fail(400, { form });
		}

		// Datan är giltig! Här kan du skapa användaren i databasen
		console.log('Användare skapad:', form.data);

		// Returnera formuläret för att visa ett success-meddelande
		redirect(303, '/register/success');
	}
};
