<script>
	import { onNavigate, afterNavigate, invalidate } from '$app/navigation';
	import '../app.css';
	import TopNav from '$lib/components/TopNav.svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import { getShowNavbar, toggleNavbar, setShowNavbar } from '$lib/utils/navBarState.svelte.js';

	import { onMount } from 'svelte';

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

<Toaster richColors position="top-left" />

<header>
	<TopNav
		{loggedIn}
		mainClass="z-50"
		navClass="lg:w-5xl w-full"
		style="height: {navBarHeight}px;"
	/>
</header>
<div
	id="main-container"
	class="relative flex flex-row justify-center overflow-y-scroll w-dvw"
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
	<div
		id="main-content"
		class="flex lg:w-195 lg:flex-none flex-1 flex-col lg:border-r-1 border-dashed w-full"
		style="min-height: calc(100dvh - {navBarHeight}px); height: 100%; "
	>
		<div style="view-transition-name: slide">{@render children()}</div>
	</div>
</div>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translatey(-30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateY(30px);
		}
	}

	:root::view-transition-old(root),
	:root::view-transition-new(root) {
		animation: none !important;
	}

	:root::view-transition-old(slide) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(slide) {
		animation:
			210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
