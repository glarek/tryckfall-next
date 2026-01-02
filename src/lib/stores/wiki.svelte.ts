import { wikiApi, type Category } from '../api/wiki';

class WikiStore {
	categories = $state<Category[]>([]);
	isLoading = $state(false);
	error = $state<string | null>(null);

	async fetchMenu() {
		this.isLoading = true;
		this.error = null;
		try {
			const response = await wikiApi.getMenu();
			if (response.status === 'success') {
				this.categories = response.data;
			} else {
				this.error = 'Failed to fetch menu';
			}
		} catch (error: any) {
			console.error('Error fetching wiki menu:', error);
			this.error = error.message || 'Unknown error';
		} finally {
			this.isLoading = false;
		}
	}
}

export const wikiStore = new WikiStore();
