<script>
	import { ModeWatcher } from 'mode-watcher';
	import NavigationMenuLink from '$lib/components/NavigationMenuLink.svelte';
	import Grit from '$lib/icons/grit.svelte';
	import { navLinks } from '$lib/config/navigation.js';

	let { class: additionalClasses = '', ...restProps } = $props();
</script>

<ModeWatcher />

<aside
	class="flex h-[calc(100dvh-3.5rem)] flex-col justify-between border-r border-l border-[var(--border)] px-4 py-6 backdrop-blur-xl {additionalClasses}"
	{...restProps}
>
	<div class="flex flex-col gap-6">
		<ul class="flex flex-col gap-2">
			{#each navLinks as navLink}
				<NavigationMenuLink
					buttonText={navLink.title}
					Icon={navLink.icon}
					link={navLink.href}
					childrenLinks={navLink.children}
				/>
			{/each}
		</ul>
	</div>

	<div class="mt-auto flex justify-center pb-4 opacity-50 transition-opacity hover:opacity-100">
		<a
			href="https://gritprojects.se"
			target="_blank"
			rel="noreferrer"
			aria-label="GRIT Projects AB"
		>
			<Grit class="fill-foreground/20 hover:fill-primary h-12 w-auto transition-colors" />
		</a>
	</div>
</aside>
