<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import MenuIcon from '$lib/icons/menu-icon.svelte';
	import { Moon, Sun, Menu, KeyRound, CircleUserRound } from '@lucide/svelte';
	import Logo from '$lib/icons/logo.svelte';
	import { getShowNavbar, toggleNavbar } from '$lib/utils/navBarState.svelte.js';
	import { base } from '$app/paths';
	let {
		mainClass: mainClasses = '',
		navClass: navClasses = '',
		loggedIn: loggedIn = false,
		admin: admin = false,
		...restProps
	} = $props();
</script>

<ModeWatcher />

<div
	{...restProps}
	class="flex flex-col border-b-1 border-dashed items-center justify-center bg-background {mainClasses}"
>
	<nav class="flex items-center pl-4 pr-4 py-4 justify-between {navClasses}">
		<Logo class="fill-foreground h-6 self-center" />
		<ul class="flex flex-row gap-x-4 items-center">
			<li class="hover:text-muted-foreground transition-colors flex">
				{#if loggedIn}
					<a href="/private" class="font-semibold hover:text-primary"
						><CircleUserRound class="relative"></CircleUserRound>
					</a>
				{:else}
					<a href="/auth" class="font-semibold"><KeyRound /></a>
				{/if}
			</li>

			<button
				class="items-center justify-center w-7 h-7 relative group cursor-pointer"
				onclick={toggleMode}
			>
				<Moon
					class="transition-all group-hover:text-indigo-700 absolute opacity-100 visible dark:invisible dark:opacity-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
				/>
				<Sun
					class="transition-all group-hover:text-yellow-400 absolute opacity-0 invisible dark:visible dark:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
				/>
			</button>
			<button
				class="items-center justify-center w-7 h-7 relative lg:hidden group cursor-pointer hover:text-muted-foreground"
				onclick={toggleNavbar}
			>
				<MenuIcon menuOpen={getShowNavbar()} />
			</button>
		</ul>
	</nav>
</div>
