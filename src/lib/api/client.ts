import { browser } from '$app/environment';
import { auth } from '../stores/auth.svelte';

export class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string = import.meta.env.PUBLIC_API_URL || 'https://api.tryckfall.nu/api') {
		this.baseUrl = baseUrl;
	}

	private getHeaders(authRequired: boolean = false): HeadersInit {
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		};

		if (authRequired && browser) {
			const token = localStorage.getItem('token');
			if (token) {
				headers['Authorization'] = `Bearer ${token}`;
			}
		}

		return headers;
	}

	async get<T>(path: string, authRequired: boolean = false): Promise<T> {
		return this.request<T>(path, 'GET', undefined, authRequired);
	}

	async post<T>(path: string, body: any, authRequired: boolean = false): Promise<T> {
		return this.request<T>(path, 'POST', body, authRequired);
	}

	async put<T>(path: string, body: any, authRequired: boolean = false): Promise<T> {
		return this.request<T>(path, 'PUT', body, authRequired);
	}

	async delete<T>(path: string, authRequired: boolean = false): Promise<T> {
		return this.request<T>(path, 'DELETE', undefined, authRequired);
	}

	async upload<T>(path: string, formData: FormData, authRequired: boolean = false): Promise<T> {
		const headers: HeadersInit = {};
		// Do NOT set Content-Type for FormData, browser sets it with boundary
		if (authRequired && browser) {
			const token = localStorage.getItem('token');
			if (token) {
				headers['Authorization'] = `Bearer ${token}`;
			}
		}

		let response = await fetch(`${this.baseUrl}${path}`, {
			method: 'POST',
			headers,
			body: formData
		});

		if (response.status === 401 && authRequired) {
			const refreshed = await this.refreshAccessToken();
			if (refreshed) {
				// Retry with new token
				const newHeaders: any = {};
				const token = localStorage.getItem('token');
				if (token) newHeaders['Authorization'] = `Bearer ${token}`;

				response = await fetch(`${this.baseUrl}${path}`, {
					method: 'POST',
					headers: newHeaders,
					body: formData
				});
			}
		}

		return this.handleResponse<T>(response);
	}

	private async request<T>(
		path: string,
		method: string,
		body?: any,
		authRequired: boolean = false
	): Promise<T> {
		let response = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers: this.getHeaders(authRequired),
			body: body ? JSON.stringify(body) : undefined
		});

		if (response.status === 401 && authRequired) {
			const refreshed = await this.refreshAccessToken();
			if (refreshed) {
				// Retry with new token
				response = await fetch(`${this.baseUrl}${path}`, {
					method,
					headers: this.getHeaders(authRequired),
					body: body ? JSON.stringify(body) : undefined
				});
			}
		}

		return this.handleResponse<T>(response);
	}

	private async refreshAccessToken(): Promise<boolean> {
		if (!browser) return false;

		const refreshToken = auth.refreshToken || localStorage.getItem('refreshToken');
		if (!refreshToken) {
			auth.logout();
			return false;
		}

		try {
			const response = await fetch(`${this.baseUrl}/auth/refresh`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify({ refresh_token: refreshToken })
			});

			if (response.ok) {
				const data = await response.json();
				if (data.status === 'success' && data.token && data.refresh_token) {
					auth.updateTokens(data.token, data.refresh_token);
					return true;
				}
			}
		} catch (error) {
			console.error('Error refreshing token:', error);
		}

		// If we reached here, refresh failed
		auth.logout();
		return false;
	}

	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			// Try to parse error message from JSON
			try {
				const errorData = await response.json();
				const error: any = new Error(
					errorData.message || `API Error: ${response.status} ${response.statusText}`
				);
				error.code = errorData.code;
				error.status = errorData.status; // 'error' status string from API
				error.httpStatus = response.status; // HTTP 400, 401 etc
				throw error;
			} catch (e: any) {
				// If parsing fails or we just re-threw our custom error
				if (e.code || e.httpStatus) throw e; // It's already our custom error

				// Fallback for non-JSON errors
				throw new Error(e.message || `API Error: ${response.status} ${response.statusText}`);
			}
		}

		const data = await response.json();
		return data as T;
	}
}

export const api = new ApiClient();
