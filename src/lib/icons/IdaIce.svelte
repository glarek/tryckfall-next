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
		d="M22,10.5L22,13.5C22,14.052 21.552,14.5 21,14.5L18,14.5C17.448,14.5 17,14.052 17,13.5L17,10.5C17,9.948 17.448,9.5 18,9.5L21,9.5C21.552,9.5 22,9.948 22,10.5Z"
	/><path
		d="M14.5,3L14.5,6C14.5,6.552 14.052,7 13.5,7L10.5,7C9.948,7 9.5,6.552 9.5,6L9.5,3C9.5,2.448 9.948,2 10.5,2L13.5,2C14.052,2 14.5,2.448 14.5,3Z"
	/><path
		d="M7,10.5L7,13.5C7,14.052 6.552,14.5 6,14.5L3,14.5C2.448,14.5 2,14.052 2,13.5L2,10.5C2,9.948 2.448,9.5 3,9.5L6,9.5C6.552,9.5 7,9.948 7,10.5Z"
	/><path
		d="M14.5,18L14.5,21C14.5,21.552 14.052,22 13.5,22L10.5,22C9.948,22 9.5,21.552 9.5,21L9.5,18C9.5,17.448 9.948,17 10.5,17L13.5,17C14.052,17 14.5,17.448 14.5,18Z"
	/><path
		d="M4.5,9.5L4.5,7.5C4.5,5.843 5.843,4.5 7.5,4.5L9.5,4.5"
		style="stroke-linecap:butt;"
	/><path
		d="M14.5,4.5L16.5,4.5C18.157,4.5 19.5,5.843 19.5,7.5L19.5,9.5"
		style="stroke-linecap:butt;"
	/><path
		d="M19.5,14.5L19.5,16.5C19.5,18.157 18.157,19.5 16.5,19.5L14.5,19.5"
		style="stroke-linecap:butt;"
	/><path
		d="M9.5,19.5L7.5,19.5C5.843,19.5 4.5,18.157 4.5,16.5L4.5,14.5"
		style="stroke-linecap:butt;"
	/></svg
>
