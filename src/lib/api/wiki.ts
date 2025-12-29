import { api } from './client';

export interface Category {
	id: number;
	name: string;
	slug: string;
	articles: Article[];
}

export interface Article {
	id: number;
	title: string;
	slug: string;
	content?: string;
	author_id?: number;
	category_id?: number;
	created_at?: string;
}

interface MenuResponse {
	status: string;
	data: Category[];
}

interface ArticleResponse {
	status: string;
	data: Article;
}

export const wikiApi = {
	getMenu: async () => {
		return api.get<MenuResponse>('/wiki/menu');
	},

	getArticle: async (slug: string) => {
		return api.get<ArticleResponse>(`/wiki/article/${slug}`);
	}
};
