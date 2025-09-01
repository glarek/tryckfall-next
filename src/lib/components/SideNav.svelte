<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	let { class: additionalClasses = '', ...restProps } = $props();
	import NavigationMenuLink from '$lib/components/NavigationMenuLink.svelte';
	import { navLinks } from '$lib/config/navigation.js';
</script>

<ModeWatcher />

<div
	class="flex justify-between border-r-1 lg:border-l-1 border-dashed px-4 py-4 font-semibold bg-background {additionalClasses} "
	{...restProps}
>
	<ul class="flex flex-col">
		{#each navLinks as navLink}
			<NavigationMenuLink
				buttonText={navLink.title}
				Icon={navLink.icon}
				link={navLink.href}
				childrenLinks={navLink.children}
			/>
		{/each}
	</ul>
	<span class="flex justify-center">En del av...</span>
</div>
