import { writable } from 'svelte/store';
import { wikiApi, type Category } from '../api/wiki';

interface WikiState {
	categories: Category[];
	isLoading: boolean;
	error: string | null;
}

const initialState: WikiState = {
	categories: [],
	isLoading: false,
	error: null
};

const createWikiStore = () => {
	const { subscribe, set, update } = writable<WikiState>(initialState);

	return {
		subscribe,
		fetchMenu: async () => {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const response = await wikiApi.getMenu();
				if (response.status === 'success') {
					update((state) => ({ ...state, categories: response.data, isLoading: false }));
				} else {
					// Fallback if status is not success but no error thrown?
					update((state) => ({ ...state, error: 'Failed to fetch menu', isLoading: false }));
				}
			} catch (error) {
				console.error('Error fetching wiki menu:', error);
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Unknown error',
					isLoading: false
				}));
			}
		}
	};
};

export const wikiStore = createWikiStore();
