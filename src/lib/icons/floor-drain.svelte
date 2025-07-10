<script lang="ts">
	// Vi definierar props med standardvärden som matchar Lucide
	let { size = 24, color = 'currentColor', strokeWidth = 2, ...rest } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke={color}
	stroke-width={strokeWidth}
	{...rest}
	version="1.1"
	style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
	><path
		xmlns="http://www.w3.org/2000/svg"
		d="M3 5h18M6 5v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5M12 14v4.105a1 1 0 0 1-.89.994L3 20"
	/></svg
>
