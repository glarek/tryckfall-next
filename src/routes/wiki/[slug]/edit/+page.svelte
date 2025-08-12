<script lang="ts">
	import { getPageDataForEdit } from '../edit.remote';
	import EditForm from './editForm.svelte'; // Vi skapar denna snart

	let { params } = $props();

	// Anropa funktionen, men invänta den INTE här. Få bara promiset.
	const pageDataPromise = getPageDataForEdit(params.slug);
</script>

{#await pageDataPromise}
	<div class="p-8 text-center">
		<p>Laddar redigeringsdata...</p>
	</div>
{:then pageData}
	<EditForm data={pageData} />
{:catch error}
	<div class="p-8 text-center text-red-500">
		<h1>Fel</h1>
		<p>Kunde inte ladda sidan: {error.message}</p>
	</div>
{/await}
