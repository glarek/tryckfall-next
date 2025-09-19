<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		} else {
			goto('/');
		}
	};

	let { data } = $props();
	let { supabase, user } = $derived(data);
</script>

<h1>Välkommen {data.profile.first_name}!</h1>
<hr />
<Button onclick={logout}>Logga ut</Button>
