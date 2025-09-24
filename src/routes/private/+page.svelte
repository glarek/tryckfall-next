<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { enhance } from '$app/forms';

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		} else {
			goto('/');
		}
	};

	let { data, form } = $props();

	let { supabase, user } = $derived(data);
</script>

<h1>Välkommen {user.user_metadata.firstName}!</h1>
<hr />
<Button onclick={logout}>Logga ut</Button>

{#if data.role === 'admin'}
	<h2>Admin Panel</h2>
	<p>Här kan du hantera användare och inställningar.</p>
	<form method="post" action="?/getUsers" use:enhance>
		<Button type="submit" name="action" value="getUsers">Hämta alla användare</Button>
	</form>

	{#if form?.profiles}
		<h3>Alla Användare:</h3>
		<ul>
			{#each form.profiles as user}
				<li>{user.first_name} {user.last_name} - {user.role}</li>
			{/each}
		</ul>
	{/if}
{/if}
