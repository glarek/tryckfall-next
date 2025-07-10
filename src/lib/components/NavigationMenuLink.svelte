<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { slide } from 'svelte/transition';
	import { ChevronRight } from '@lucide/svelte'; // Ikon för att indikera expanderbart tillstånd
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { setShowNavbar } from '$lib/utils/navBarState.svelte.js';
	import MenuLink from '$lib/components/MenuLink.svelte';

	let {
		open = $bindable(false),
		buttonText,
		childrenLinks = [],
		icon, // Svelte-komponent för ikonen bredvid knapptexten
		link,
		...restProps
	} = $props();
	let activeLink = $derived(
		page.url.pathname.replace(base, '').split('/')[1] == link.replace(base, '').split('/')[1]
	);
</script>

<Collapsible.Root class="flex w-full flex-col items-start" bind:open {...restProps}>
	{#if childrenLinks.length === 0}
		<Collapsible.Trigger class="w-full {activeLink ? 'text-primary' : ''}">
			<a
				href={link}
				onclick={() => setShowNavbar(false)}
				class="flex w-full items-center gap-2 rounded-sm p-2 m-1 text-left hover:bg-muted"
			>
				{#if icon}
					<svelte:component this={icon} size={18} />
				{/if}
				{buttonText}
			</a>
		</Collapsible.Trigger>{:else}
		<Collapsible.Trigger class="w-full {activeLink ? 'text-primary' : ''}">
			<span
				class="flex items-center gap-2 w-full justify-between rounded-sm p-2 m-1 text-left hover:bg-muted"
			>
				<div class="flex flex-row items-center gap-2">
					{#if icon}
						<svelte:component this={icon} size={18} />
					{/if}
					{buttonText}
				</div>

				<ChevronRight
					size={16}
					class="transform transition-transform duration-200 {open ? 'rotate-90' : ''}"
				/>
			</span>
		</Collapsible.Trigger>
		<Collapsible.Content forceMount>
			{#if open}
				<div class="ml-1 left-6 pl-4 my-2 pt-0 pb-1 font-medium" transition:slide>
					{#each childrenLinks as childLink}
						<MenuLink link="{base}{childLink.href}">{childLink.title}</MenuLink>
					{/each}
				</div>
			{/if}
		</Collapsible.Content>
	{/if}
</Collapsible.Root>
