<script lang="ts">
	import { page } from '$app/state';
	let { link, children, ...restProps } = $props();
	import { base } from '$app/paths';

	let activeLink = $derived(page.url.pathname.replace(base, '') == link.replace(base, ''));
	let test = page.url.pathname;
	import { getShowNavbar, toggleNavbar, setShowNavbar } from '$lib/utils/navBarState.svelte.js';
</script>

<li
	class="text-muted-foreground hover:text-foreground {activeLink
		? 'text-primary hover:text-primary'
		: ''}"
>
	<a href={link} onclick={() => setShowNavbar(false)}>{@render children()}</a>
</li>
