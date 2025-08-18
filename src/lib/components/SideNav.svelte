<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	let { class: additionalClasses = '', ...restProps } = $props();
	import NavigationMenuLink from '$lib/components/NavigationMenuLink.svelte';
	import { base } from '$app/paths';
	import { navLinks } from '$lib/config/navigation.js';
</script>

<ModeWatcher />

<div
	class="flex justify-between border-r-2 lg:border-l-2 border-dashed px-4 py-4 font-semibold bg-background {additionalClasses} "
	{...restProps}
>
	<ul class="flex flex-col">
		{#each navLinks as navLink}
			<NavigationMenuLink
				buttonText={navLink.title}
				icon={navLink.icon}
				link="{base}{navLink.href}"
				childrenLinks={navLink.children}
			/>
		{/each}
	</ul>
	<span class="flex justify-center">En del av...</span>
</div>
