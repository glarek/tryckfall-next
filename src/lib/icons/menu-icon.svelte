<script>
	let {
		menuOpen = false,
		color = 'currentColor',
		strokeWidth = '5px',
		height = '20px',
		width = '28px'
	} = $props();
</script>

<div class="hamb {menuOpen ? 'active' : ''} w-fit h-fit">
	<svg stroke={color} class="ham" viewBox="0 0 50 50" style="width: {width}; height: {height}">
		<path
			class="line top"
			d="m 5,8 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
			stroke-width={strokeWidth}
		>
		</path>
		<path class="line middle" d="m 5,25 h 40" stroke-width={strokeWidth}> </path>
		<path
			class="line bottom"
			d="m 45,42 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
			stroke-width={strokeWidth}
		>
		</path>
	</svg>
</div>

<style>
	.hamb {
		position: relative;
		margin-right: -0.625rem;
		border-width: 0px;
		background-color: transparent;
		padding: 0;
	}

	.hamb .ham {
		-webkit-tap-highlight-color: transparent;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}
	.hamb .ham {
		height: 60px;
		width: 100%;
		cursor: pointer;
		transition-duration: 0.3s;
	}
	.hamb .ham .top {
		stroke-dasharray: 40 160;
	}
	.hamb .ham .middle {
		transform-origin: 50%;
		stroke-dasharray: 40 142;
	}
	.hamb .ham .bottom {
		transform-origin: 50%;
		stroke-dasharray: 40 85;
	}
	.hamb .line {
		fill: none;

		transition-duration: 0.3s;
		stroke-linecap: round;
	}
	.hamb.active svg {
		--tw-rotate: 45deg;
		transform: rotate(var(--tw-rotate));
	}
	.hamb.active svg .top {
		stroke-dashoffset: -64px;
	}
	.hamb.active svg .middle {
		--tw-rotate: 90deg;
		transform: rotate(var(--tw-rotate));
	}
	.hamb.active svg .bottom {
		stroke-dashoffset: -64px;
	}
</style>
