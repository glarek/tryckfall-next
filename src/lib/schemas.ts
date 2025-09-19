import { z } from 'zod/v4';

export const registerSchema = z
	.object({
		email: z.email({ message: 'Ogiltig e-postadress' }),
		firstName: z.string().min(1, { message: 'Förnamn är obligatoriskt' }),
		lastName: z.string().min(1, { message: 'Efternamn är obligatoriskt' }),
		password: z.string().min(8, { message: 'Lösenordet måste vara minst 8 tecken långt' }),
		repeatPassword: z.string()
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: 'Lösenorden matchar inte',
		path: ['repeatPassword']
	});
