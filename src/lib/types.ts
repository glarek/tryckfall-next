//Here we can fill in our custom types if deemed necessary.
import { z } from 'zod';
import { registerSchema } from '$lib/schemas';

// Genererar en typ baserad på schemat!
export type RegistrationSchema = z.infer<typeof registerSchema>;
