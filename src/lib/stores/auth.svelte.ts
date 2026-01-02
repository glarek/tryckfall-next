import { browser } from '$app/environment';
import type { User } from '../types';

class AuthStore {
	user = $state<User | null>(null);
	token = $state<string | null>(null);
	refreshToken = $state<string | null>(null);
	isAuthenticated = $state(false);

	constructor() {}

	login(user: User, token: string, refreshToken: string) {
		if (browser) {
			localStorage.setItem('token', token);
			localStorage.setItem('refreshToken', refreshToken);
			localStorage.setItem('user', JSON.stringify(user));
		}
		this.user = user;
		this.token = token;
		this.refreshToken = refreshToken;
		this.isAuthenticated = true;
	}

	updateTokens(token: string, refreshToken: string) {
		if (browser) {
			localStorage.setItem('token', token);
			localStorage.setItem('refreshToken', refreshToken);
		}
		this.token = token;
		this.refreshToken = refreshToken;
	}

	logout() {
		if (browser) {
			localStorage.removeItem('token');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('user');
		}
		this.user = null;
		this.token = null;
		this.refreshToken = null;
		this.isAuthenticated = false;
	}

	initialize() {
		if (browser) {
			const token = localStorage.getItem('token');
			const refreshToken = localStorage.getItem('refreshToken');
			const userStr = localStorage.getItem('user');
			if (token && userStr) {
				try {
					const user = JSON.parse(userStr);
					this.user = user;
					this.token = token;
					this.refreshToken = refreshToken;
					this.isAuthenticated = true;
				} catch (e) {
					// invalid user data
					this.logout();
				}
			}
		}
	}
}

export const auth = new AuthStore();
