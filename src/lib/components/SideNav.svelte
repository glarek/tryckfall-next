<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { slide } from 'svelte/transition';

	import NavigationMenuLink from '$lib/components/NavigationMenuLink.svelte';
	import Grit from '$lib/icons/grit.svelte';
	import { navLinks } from '$lib/config/navigation.js';
	import { onMount } from 'svelte';
	import { CircleUserRound, ShieldUser } from '@lucide/svelte';

	let { class: additionalClasses = '', loggedIn, ...restProps } = $props();
	let userLoad = $state(false);

	onMount(() => {
		userLoad = true;
	});
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
		{#if userLoad}
			<div transition:slide>
				<hr />
				{#if loggedIn}
					<NavigationMenuLink buttonText="Användare" Icon={CircleUserRound} link="/private" />
				{:else}
					<NavigationMenuLink buttonText="Logga in" Icon={ShieldUser} link="/auth" />
				{/if}
			</div>
		{/if}
	</ul>

	<div class="flex flex-col items-center justify-center gap-y-3 my-4 popclick">
		<a href="https://google.se"
			><Grit class="hover:text-primary h-14 text-foreground/5 transition-colors" /></a
		>
	</div>
</div>
