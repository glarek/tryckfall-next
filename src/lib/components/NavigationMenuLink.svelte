<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { slide } from 'svelte/transition';
	import { ChevronRight } from '@lucide/svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { setShowNavbar } from '$lib/utils/navBarState.svelte.js';
	import MenuLink from '$lib/components/MenuLink.svelte';

	let {
		open = $bindable(false),
		buttonText,
		childrenLinks = [],
		Icon,
		link,
		...restProps
	} = $props();

	let activeLink = $derived(
		page.url.pathname.replace(base, '').split('/')[1] === link.replace(base, '').split('/')[1]
	);

	const baseTriggerClass =
		'm-0.5 ml-0 flex w-full items-center gap-2 rounded-lg p-2 text-left font-medium transition-all duration-200 hover:translate-x-1 hover:bg-muted hover:text-accent-foreground focus-visible:bg-muted focus-visible:outline-none';
</script>

{#snippet linkInner()}
	{#if Icon}
		<Icon size={18} />
	{/if}
	{buttonText}
{/snippet}

<Collapsible.Root class="flex w-full flex-col items-start" bind:open {...restProps}>
	<Collapsible.Trigger class="w-full {activeLink ? 'text-primary' : ''}">
		{#if childrenLinks.length === 0}
			<a href={link} onclick={() => setShowNavbar(false)} class="{baseTriggerClass} popclick">
				{@render linkInner()}
			</a>
		{:else}
			<span class="{baseTriggerClass} justify-between">
				<div class="flex flex-row items-center gap-2">
					{@render linkInner()}
				</div>
				<ChevronRight
					size={16}
					class="transform transition-transform duration-200 {open ? 'rotate-90' : ''}"
				/>
			</span>
		{/if}
	</Collapsible.Trigger>

	{#if childrenLinks.length > 0}
		<Collapsible.Content forceMount>
			{#if open}
				<div class="left-6 my-2 ml-1 pt-0 pb-1 pl-4 font-medium" transition:slide>
					{#each childrenLinks as childLink}
						<MenuLink link={childLink.href}>{childLink.title}</MenuLink>
					{/each}
				</div>
			{/if}
		</Collapsible.Content>
	{/if}
</Collapsible.Root>
