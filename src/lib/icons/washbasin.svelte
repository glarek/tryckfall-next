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
		d="M4 8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2c0 3.279-9.562 3-12 3H6a2 2 0 0 1-2-2V8ZM12 14.006V17.5a1.5 1.5 0 0 1-3 0 1.5 1.5 0 0 0-3 0V22M6 6.994V3l5-1v2"
	/></svg
>
