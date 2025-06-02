<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { slide } from 'svelte/transition';
	import { ChevronRight } from '@lucide/svelte'; // Ikon för att indikera expanderbart tillstånd
	import { page } from '$app/state';
	import {base} from '$app/paths';

	let {
		open = $bindable(false),
		// ref = $bindable(null), // ref användes inte i mallen
		buttonText,
		children = null, // Snippet för innehållet i den expanderbara sektionen
		icon, // Svelte-komponent för ikonen bredvid knapptexten
		link,
		...restProps
	} = $props();
	let activeLink = $derived(page.url.pathname.replace(base, '').split('/')[1] == link.replace(base, '').split('/')[1]);
	let test = page.url.pathname;
</script>

<Collapsible.Root class="flex w-full flex-col items-start" bind:open {...restProps}>
	{#if !children}
		<Collapsible.Trigger class="w-full {activeLink ? 'text-primary' : ''}">
			<a
				href={link}
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

				{#if children}
					<ChevronRight
						size={16}
						class="transform transition-transform duration-200 {open ? 'rotate-90' : ''}"
					/>
				{/if}
			</span>
		</Collapsible.Trigger>
		{#if children}
			<Collapsible.Content forceMount>
				{#if open}
					<div
						class="ml-4 border-l left-6 pl-4 my-2 pt-0 pb-1 space-y-1 font-medium"
						transition:slide
					>
						{@render children?.()}
					</div>
				{/if}
			</Collapsible.Content>
		{/if}{/if}
</Collapsible.Root>
