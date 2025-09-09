<script>
	let { circleClass, arrowClass } = $props();
	let test = false;
</script>

<div class="relative w-6 h-6">
	<svg
		class=" absolute {circleClass}"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		width="100%"
		height="100%"
		viewBox="0 0 71 71"
		version="1.1"
		xml:space="preserve"
		style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
		><path
			d="M62.53,17.222c3.459,5.184 5.476,11.41 5.476,18.104c0,18.037 -14.643,32.68 -32.68,32.68c-18.036,0 -32.679,-14.643 -32.679,-32.68c-0,-18.036 14.643,-32.679 32.679,-32.679c3.998,-0 7.829,0.719 11.371,2.036"
			style="fill:none;stroke:#000;stroke-width:5.29px;"
		/></svg
	>

	<svg
		class="absolute {arrowClass}"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		width="100%"
		height="100%"
		viewBox="0 0 71 71"
		version="1.1"
		xml:space="preserve"
		style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
		><path
			d="M61.813,35.326l-39.862,-23.014l-0,46.029l39.862,-23.015"
			style="fill:none;stroke:#000;stroke-width:5.29px;"
		/></svg
	>
</div>
