<script lang="ts">
	import { getPageDataForEdit } from '../../wiki.remote';
	import EditForm from './editForm.svelte';
	import { blur, slide } from 'svelte/transition';

	let { params } = $props();

	// Anropa funktionen, men invänta den INTE här. Få bara promiset.
	const pageDataPromise = getPageDataForEdit(params.slug);
</script>

<main>
	{#await pageDataPromise}
		<div transition:slide class="p-8 text-center">
			<p>Laddar redigeringsdata...</p>
		</div>
	{:then pageData}
		<div transition:blur>
			<EditForm data={pageData} />
		</div>
	{:catch error}
		<div transition:blur class="p-8 text-center text-red-500">
			<h1>Fel</h1>
			<p>Kunde inte ladda sidan: {error.message}</p>
		</div>
	{/await}
</main>
