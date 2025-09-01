<script lang="ts">
	import type { PageData } from './$types';

	// Använd $props() för att deklarera props i Svelte 5
	const { data } = $props<{ data: PageData }>();

	// Nu kan du direkt komma åt data.session.user.email
	// Använd $derived för reaktiva värden baserade på props eller andra reaktiva tillstånd
	const userEmail = $derived(data.session?.user?.email);
</script>

<h1>Välkommen till min sida!</h1>

{#if userEmail}
	<p>Du är inloggad som: {userEmail}</p>
{:else}
	<p>Du är inte inloggad.</p>
{/if}
