<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Moon, Sun, Menu, X, UserCheck, UserRoundX } from '@lucide/svelte';
	import Logo from '$lib/icons/logo.svelte';
	import { getShowNavbar, toggleNavbar } from '$lib/utils/navBarState.svelte.js';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';

	let { mainClass: mainClasses = '', navClass: navClasses = '', ...restProps } = $props();

	import { auth } from '$lib/stores/auth.svelte.ts';
</script>

<ModeWatcher />

<header
	{...restProps}
	class="bg-background/60 supports-[backdrop-filter]:bg-background/10 sticky top-0 z-50 flex w-full justify-center border-b border-[var(--border)] backdrop-blur-xl {mainClasses}"
>
	<nav class="flex h-full items-center justify-between px-4 {navClasses}">
		<a href="/" class="popclick flex items-center gap-2">
			<Logo
				href="/"
				class="hover:text-primary text-foreground w-[120px] transition-colors duration-300"
			/>
		</a>

		<div class="flex items-center gap-4">
			<button
				class="btn-base bg-muted/50 hover:bg-muted popclick relative h-9 w-9 rounded-full"
				onclick={() => goto(auth.isAuthenticated ? '/private' : '/auth')}
				aria-label="Account"
			>
				<UserRoundX
					class="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 transition-all {auth.isAuthenticated
						? 'scale-0 rotate-90'
						: 'scale-100 rotate-0'}"
				/>
				<UserCheck
					class="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 transition-all {auth.isAuthenticated
						? 'scale-100 rotate-0'
						: 'scale-0 rotate-90'}"
				/>
			</button>
			<button
				class="btn-base bg-muted/50 hover:bg-muted popclick relative h-9 w-9 rounded-full"
				onclick={toggleMode}
				aria-label="Toggle theme"
			>
				<Moon
					class="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
				/>
				<Sun
					class="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
				/>
			</button>

			<button
				class="btn-base hover:bg-accent hover:text-accent-foreground relative h-9 w-9 items-center justify-center rounded-full transition-colors lg:hidden"
				onclick={toggleNavbar}
				aria-label="Toggle menu"
			>
				<Menu
					class="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 transition-all {getShowNavbar()
						? 'scale-0 rotate-90'
						: 'scale-100 rotate-0'}"
				/>
				<X
					class="absolute top-1/2 left-1/2 h-[1.2rem] w-[1.2rem] -translate-x-1/2 -translate-y-1/2 transition-all {getShowNavbar()
						? 'scale-100 rotate-0'
						: 'scale-0 rotate-90'}"
				/>
			</button>
		</div>
	</nav>
</header>
