<script>
	let { data, children } = $props();
	let { supabase } = $derived(data);
</script>

<main>
	{@render children()}
</main>
