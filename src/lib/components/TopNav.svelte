<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Moon, Sun, Menu } from '@lucide/svelte';
	import Logo from '$lib/icons/logo.svelte';
	import { getShowNavbar, toggleNavbar } from '$lib/utils/navBarState.svelte.js';
	import { base } from '$app/paths';
	let { mainClass: mainClasses = '', navClass: navClasses = '', ...restProps } = $props();
</script>

<ModeWatcher />

<div
	{...restProps}
	class="flex flex-col border-b-1 top-0 items-center justify-center w-full bg-background shadow-xs {mainClasses}"
>
	<nav class="flex items-center pl-4 pr-4 py-4 justify-between {navClasses}">
		<Logo class="fill-foreground h-6 self-center" />
		<ul class="flex flex-row space-x-4 items-center font-semibold">
			<li class="hover:text-muted-foreground transition-colors hidden md:flex">
				<a href="{base}/tryckfall">Tryckfall</a>
			</li>
			<li class="hover:text-muted-foreground transition-colors hidden md:flex">
				<a href="{base}/om">Om</a>
			</li>
			<li class="hover:text-muted-foreground transition-colors hidden md:flex">
				<a href="{base}/kontakt">Kontakt</a>
			</li>
			<button
				class="items-center justify-center w-7 h-7 relative lg:hidden group cursor-pointer"
				onclick={toggleNavbar}
			>
				<Menu class="transition-colors" />
			</button>
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
		</ul>
	</nav>
</div>
