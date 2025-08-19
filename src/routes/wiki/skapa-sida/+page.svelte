<script lang="ts">
	import { getCategories } from '../wiki.remote';
	import EditForm from '../../wiki/[slug]/edit/editForm.svelte'; // Vi skapar denna snart
	import { blur, slide } from 'svelte/transition';

	// Anropa funktionen, men invänta den INTE här. Få bara promiset.
	const categoriesPromise = getCategories();
</script>

<main>
	{#await categoriesPromise}
		<div transition:slide class="p-8 text-center">
			<p>Laddar kategorier...</p>
		</div>
	{:then categories}
		<div transition:blur>
			<EditForm data={categories} />
		</div>
	{:catch error}
		<div transition:blur class="p-8 text-center text-red-500">
			<h1>Fel</h1>
			<p>Kunde inte ladda sidan: {error.message}</p>
		</div>
	{/await}
</main>
