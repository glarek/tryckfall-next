<script>
	let { children } = $props();
	import '../app.css';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Moon, Sun, Menu } from '@lucide/svelte';
	import Logo from '../lib/icons/logo.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import TopNav from '$lib/components/TopNav.svelte';
	import SideNav from '$lib/components/SideNav.svelte';
	import { getShowNavbar, toggleNavbar, setShowNavbar } from '$lib/utils/navBarState.svelte.js';
	import { get } from 'svelte/store';
	import { onNavigate } from '$app/navigation';

	let navBarHeight = 50;
</script>

<TopNav mainClass="z-50" navClass="lg:w-5xl w-full" style="height: {navBarHeight}px" />
<div
	class="relative flex flex-row justify-center w-dvw overflow-y-scroll"
	style="max-height: calc(100dvh - {navBarHeight}px)"
>
	<SideNav
		class="h-screen fixed lg:sticky lg:top-0 lg:flex flex-col left-0 w-60 transition-all duration-300 ease-in-out overflow-y-auto  {getShowNavbar()
			? 'translate-x-0'
			: '-translate-x-full'} lg:translate-x-0 z-40"
		style="height: calc(100dvh - {navBarHeight}px);"
	/>
	<div
		id="overlay"
		class="fixed inset-0 lg:hidden bg-black/50 z-30 duration-200 transition-all ease-in-out {getShowNavbar()
			? 'no-doc-scroll visible opacity-100 backdrop-blur-xs'
			: 'invisible opacity-0'}"
		style="top: {navBarHeight}px"
		onclick={() => setShowNavbar(false)}
	></div>
	<main
		class="flex lg:w-195 lg:flex-none flex-1 flex-col py-4 px-4 lg:border-r-1 border-dashed max-w-screen"
		style="min-height: calc(100dvh - {navBarHeight}px); height: 100%"
	>
		{@render children()}
	</main>
</div>
