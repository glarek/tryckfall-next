import { api } from './client';
import type { Category, Article } from './wiki';

interface UploadResponse {
	status: string;
	url: string;
	filename: string;
}

export const adminApi = {
	// Categories
	createCategory: async (data: { name: string; slug: string; sort_order: number }) => {
		return api.post('/wiki/categories', data, true);
	},
	updateCategory: async (id: number, data: { name: string; slug: string; sort_order: number }) => {
		return api.put(`/wiki/categories/${id}`, data, true);
	},
	deleteCategory: async (id: number) => {
		return api.delete(`/wiki/categories/${id}`, true);
	},

	// Articles
	createArticle: async (data: {
		category_id: number;
		title: string;
		slug: string;
		content: string;
	}) => {
		return api.post('/wiki/articles', data, true);
	},
	updateArticle: async (
		id: number,
		data: { category_id: number; title: string; slug: string; content: string }
	) => {
		return api.put(`/wiki/articles/${id}`, data, true);
	},
	deleteArticle: async (id: number) => {
		return api.delete(`/wiki/articles/${id}`, true);
	},

	// Upload
	uploadImage: async (file: File) => {
		const formData = new FormData();
		formData.append('image', file);
		return api.upload<UploadResponse>('/wiki/upload', formData, true);
	}
};
