import { api } from './client';
import type { User } from '../types';

interface AuthResponse {
	status: string;
	token?: string;
	user?: User;
	message?: string;
}

export const authApi = {
	login: async (email: string, password: string) => {
		return api.post<AuthResponse>('/auth/login', { email, password });
	},

	register: async (userData: any) => {
		return api.post<AuthResponse>('/auth/register', userData);
	},

	verify: async (token: string) => {
		return api.get<AuthResponse>(`/auth/verify?token=${token}`);
	}
};
