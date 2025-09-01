import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	optimizeDeps: {
		include: ['svelte-sonner'],
		exclude: ['svelte-codemirror-editor', 'codemirror', '@codemirror/language-markdown' /* ... */]
	}
});
