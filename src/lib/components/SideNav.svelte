<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { House, Gauge, CloudDrizzle, Toilet } from '@lucide/svelte';
	import { IdaIce } from '$lib/icons/index';
	let { class: additionalClasses = '', ...restProps } = $props();
	import NavigationMenuLink from '$lib/components/NavigationMenuLink.svelte';
	import MenuLink from '$lib/components/MenuLink.svelte';
	import { base } from '$app/paths';
</script>

<ModeWatcher />

<div
	class="flex justify-between border-r-1 lg:border-l-1 border-dashed px-4 py-4 font-semibold bg-background {additionalClasses} "
	{...restProps}
>
	<ul class="flex flex-col">
		<NavigationMenuLink buttonText="Hem" icon={House} link="{base}/"></NavigationMenuLink>

		<NavigationMenuLink buttonText="Tryckfall" icon={Gauge} link="{base}/tryckfall">
			<MenuLink link="{base}/tryckfall/ror">Rör</MenuLink>
			<MenuLink link="{base}/tryckfall/luft">Luft</MenuLink>
		</NavigationMenuLink>

		<NavigationMenuLink buttonText="Dagvatten" icon={CloudDrizzle} link="{base}/dagvatten">
			<MenuLink link="{base}/dagvatten/ror">Rör</MenuLink>
		</NavigationMenuLink>
		<NavigationMenuLink buttonText="Spillvatten" icon={Toilet} link="{base}/spillvatten">
			<MenuLink link="{base}/spillvatten/flode">Flöde</MenuLink>
			<MenuLink link="{base}/spillvatten/fettavskiljare">Fettavskiljare</MenuLink>
		</NavigationMenuLink>
		<NavigationMenuLink buttonText="Skript - IDA ICE" icon={IdaIce} link="{base}/ida-ice-skript"
		></NavigationMenuLink>
	</ul>
	<span class="flex justify-center">En del av...</span>
</div>
