<script>
	import { onNavigate, afterNavigate, invalidate } from '$app/navigation';
	import '../app.css';
	import TopNav from '$lib/components/TopNav.svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { navLinks } from '$lib/config/navigation';

	import { getShowNavbar, toggleNavbar, setShowNavbar } from '$lib/utils/navBarState.svelte.js';

	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { derived } from 'svelte/store';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	let loggedIn = $derived(session !== null);

	let navBarHeight = 50;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	afterNavigate(() => {
		const mainContainer = document.getElementById('main-container');
		if (mainContainer) {
			mainContainer.scrollTop = 0;
		}
	});
</script>

<TopNav {loggedIn} mainClass="z-50" navClass="lg:w-5xl w-full" style="height: {navBarHeight}px" />
<div
	id="main-container"
	class="relative flex flex-row justify-center w-dvw overflow-y-scroll"
	style="max-height: calc(100dvh - {navBarHeight}px)"
>
	<SideNav
		class="h-screen fixed lg:sticky lg:top-0 lg:flex flex-col left-0 w-60 transition-all duration-300 ease-in-out overflow-y-auto  {getShowNavbar()
			? 'translate-x-0'
			: '-translate-x-full'} lg:translate-x-0 z-40"
		style="height: calc(100dvh - {navBarHeight}px);"
	/>
	<button
		type="button"
		id="overlay"
		aria-label="Close sidebar overlay"
		class="fixed inset-0 lg:hidden bg-black/50 z-30 duration-200 transition-all ease-in-out {getShowNavbar()
			? 'no-doc-scroll visible opacity-100 backdrop-blur-xs'
			: 'invisible opacity-0'}"
		style="top: {navBarHeight}px"
		onclick={() => setShowNavbar(false)}
		tabindex="0"
	></button>
	<main
		class="flex lg:w-195 lg:flex-none flex-1 flex-col lg:border-r-1 border-dashed max-w-screen"
		style="min-height: calc(100dvh - {navBarHeight}px); height: 100%"
	>
		{@render children()}
	</main>
</div>
