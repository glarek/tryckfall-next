<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import MenuIcon from '$lib/icons/menu-icon.svelte';
	import { Moon, Sun, Menu, KeyRound, CircleUserRound } from '@lucide/svelte';
	import Logo from '$lib/icons/logo.svelte';

	import { getShowNavbar, toggleNavbar } from '$lib/utils/navBarState.svelte.js';

	import { getContext } from 'svelte';

	let {
		mainClass: mainClasses = '',
		navClass: navClasses = '',
		admin: admin = false,
		...restProps
	} = $props();

	let navigating = getContext('navigating');
</script>

<ModeWatcher />

<div
	{...restProps}
	class="flex flex-col border-b-1 border-dashed items-center justify-center bg-background {mainClasses}"
>
	<nav class="flex items-center pl-4 pr-4 py-4 justify-between {navClasses}">
		<a href="/" class="popclick">
			<Logo
				href="/"
				class="hover:fill-primary fill-foreground h-7 self-center transition-colors duration-75"
			/>
		</a>

		<ul class="flex flex-row gap-x-4 items-center">
			<li class="hover:text-muted-foreground transition-colors flex"></li>

			<button
				class="items-center justify-center w-7 h-7 relative group cursor-pointer popclick"
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
