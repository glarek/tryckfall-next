<script lang="ts">
	import { page } from '$app/state';
	let { link, children, ...restProps } = $props();
	import { base } from '$app/paths';

	let activeLink = $derived(page.url.pathname.includes(link));
	import { setShowNavbar } from '$lib/utils/navBarState.svelte.js';
</script>

<li
	class="text-muted-foreground hover:text-foreground hover:border-foreground border-l-2 py-0.5 pl-3 popclick {activeLink
		? 'text-primary border-primary'
		: ''}"
>
	<a href={link} onclick={() => setShowNavbar(false)}>{@render children()}</a>
</li>
