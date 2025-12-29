import { browser } from '$app/environment';

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

		const response = await fetch(`${this.baseUrl}${path}`, {
			method: 'POST',
			headers,
			body: formData
		});

		return this.handleResponse<T>(response);
	}

	private async request<T>(
		path: string,
		method: string,
		body?: any,
		authRequired: boolean = false
	): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method,
			headers: this.getHeaders(authRequired),
			body: body ? JSON.stringify(body) : undefined
		});

		return this.handleResponse<T>(response);
	}

	private async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			// Try to parse error message from JSON
			try {
				const errorData = await response.json();
				throw new Error(
					errorData.message || `API Error: ${response.status} ${response.statusText}`
				);
			} catch (e: any) {
				// If parsing fails or errorData has no message, fallback to status text
				throw new Error(e.message || `API Error: ${response.status} ${response.statusText}`);
			}
		}

		const data = await response.json();
		// Some endpoints return { status: 'success', data: ... } or just the data directly?
		// documentation says: { status: "success", data: ... } usually.
		// Let's return the raw JSON for now and let specialized clients handle structure,
		// OR normalize it here. Based on docs, responses are wrapped.

		return data as T;
	}
}

export const api = new ApiClient();
