//Here we can fill in our custom types if deemed necessary.
import { z } from 'zod';
import { registerSchema } from '$lib/schemas';

export interface User {
	email: string;
	first_name: string;
	last_name: string;
	role: string;
}

// Genererar en typ baserad på schemat!
export type RegistrationSchema = z.infer<typeof registerSchema>;
