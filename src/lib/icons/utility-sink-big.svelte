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
		d="M10 15v3.494a1.5 1.5 0 0 1-3 0 1.5 1.5 0 0 0-3 0V22M4 8h16a.997.997 0 0 1 1 1v2a3 3 0 0 1-3 3H4M4 2v12M4 4l6 .003V5"
	/></svg
>
