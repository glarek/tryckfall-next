<script lang="ts">
	import { page } from '$app/state';
	let { link, children, ...restProps } = $props();
	let activeLink = $derived(page.url.pathname == link);
	import { getShowNavbar, toggleNavbar, setShowNavbar } from '$lib/utils/navBarState.svelte.js';
</script>

<li
	class="text-muted-foreground hover:text-foreground {activeLink
		? 'text-primary hover:text-primary'
		: ''}"
>
	<a href={link} onclick={() => setShowNavbar(false)}>{@render children()}</a>
</li>
