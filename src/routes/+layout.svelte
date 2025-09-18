<script>
	import { beforeNavigate, onNavigate, afterNavigate, invalidate } from '$app/navigation';
	import { page } from '$app/state';
	const metadata = $derived(page.data?.pageMeta ?? []);

	$inspect(metadata);

	import '../app.css';
	import TopNav from '$lib/components/TopNav.svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { setContext } from 'svelte';

	import { getShowNavbar, toggleNavbar, setShowNavbar } from '$lib/utils/navBarState.svelte.js';

	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	let loggedIn = $derived(session !== null);

	let navBarHeight = 50;
	let navigating = $state({ isNavigating: false });

	setContext('navigating', navigating);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	beforeNavigate(async () => {
		navigating.isNavigating = true;
		return;
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
	});

	afterNavigate(() => {
		const mainContainer = document.getElementById('main-container');
		if (mainContainer) {
			mainContainer.scrollTop = 0;
		}
		navigating.isNavigating = false;
	});
</script>

<svelte:head>
	<title
		>{metadata.title ? metadata.title + ' - tryckfall.nu' : 'tryckfall.nu - VVS-beräkningar'}</title
	>
	{#each metadata as meta}
		<meta {...meta} />
	{/each}
</svelte:head>

<Toaster richColors position="top-left" />

<header class="z-50 sticky top-0">
	<TopNav mainClass="h-[3rem]" navClass="lg:w-5xl w-full" />
</header>

<span
	class="{navigating.isNavigating
		? 'h-[2px]'
		: 'h-[0px]'} top-[calc(3rem-1px)] z-99 absolute loader transition-all duration-500"
></span>

<div id="main-container" class="flex flex-row justify-center items-start">
	<SideNav
		{loggedIn}
		class="h-[calc(100dvh-3rem)] fixed lg:sticky lg:top-[3rem] lg:flex flex-col left-0 w-60 transition-all duration-300 ease-in-out overflow-y-auto  {getShowNavbar()
			? 'translate-x-0'
			: '-translate-x-full'} lg:translate-x-0 z-40"
	/>
	<button
		type="button"
		id="overlay"
		aria-label="Close sidebar overlay"
		class="fixed top-[3rem] left-0 w-full h-full lg:hidden bg-black/50 z-30 duration-200 transition-all ease-in-out {getShowNavbar()
			? 'no-doc-scroll visible opacity-100 backdrop-blur-xs'
			: 'invisible opacity-0'}"
		onclick={() => setShowNavbar(false)}
		tabindex="0"
	></button>
	<div
		id="main-content"
		class="flex pb-4 lg:w-195 lg:flex-none flex-1 flex-col lg:border-r-1 border-dashed w-full min-h-[calc(100svh-3rem)]"
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
