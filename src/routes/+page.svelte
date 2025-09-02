<script>
	let { data } = $props();
	import { Button } from '$lib/components/ui/button';
</script>

<div class="m-20">
	<div class="grid md:grid-cols-[3fr_1fr] gap-10 w-full justify-center items-center">
		<div class="md:order-1 order-2">
			<h1 class="text-3xl font-bold text-left">
				Din sida för <mark class=" font-">tryckfall-</mark> och andra VVS-beräkningar!
			</h1>
			<p class="mt-5 mb-5">
				Utför snabba beräkningar i rör och kanaler med <a
					href="https://coolprop.org/"
					class="hover:text-primary underline underline-offset-1 decoration-2 decoration-wavy"
				>
					CoolProp
				</a>
				och håll dig uppdaterad med nya verktyg.
			</p>
			<div class="grid grid-cols-[1fr_1fr] gap-2 mt-2 md:w-fit w-full">
				<Button variant="outline" class=" cursor-pointer rounded-lg" href="/tryckfall/ror"
					>Tryckfall i rör</Button
				>
				<Button variant="outline" class=" cursor-pointer rounded-lg" href="/tryckfall/luft"
					>Tryckfall i kanaler</Button
				>
			</div>
		</div>
		<div class="md:order-2 order-1 justify-self-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xml:space="preserve"
				fill="currentColor"
				stroke="currentColor"
				width="167"
				style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5"
				viewBox="0 0 167 189"
				><path
					d="M78.197 81.208c.83 5.014 2.347 7.513 3.245 9.659 1.494-1.947 3.081-3.832 3.829-7.678 1.572 2.834 3.179 6.661 4.519 7.682 1.045-3.638 2.698-12.154 2.698-12.154M60.291 103.06c2.999-.286 6.749-.668 9.481-1.679"
					style="fill:none;stroke-width:1.5px"
				/><path
					d="M65.468 102.439c-.39 4.541-.021 8.635 0 12.699M71.933 107.204c.006-4.453 3.909-7.532 6.875-4.78 4.306 3.996 2.568 9.624-.976 11.208-2.453 1.097-5.904-3.047-5.899-6.428ZM58.528 122.998c2.5 3.654 3.826 7.428 5.772 12.48 1.204-4.176 1.85-9.759 3.304-15.023M70.617 120.147c2.358 4.599 2.598 8.326 4.743 14.106 1.293-3.167 1.731-7.868 3.365-14.659M88.785 119.594c-1.727-.005-6.008.29-6.994 3.252-1.086 3.266 4.476 2.126 6.994 5.272 3.06 3.824-3.57 8.552-8.155 4.57M70.938 81.055c3.668 0 3.874 4.431 4.054 6.368.18 1.937.121 5.22-2.973 5.254-1.304.014-4.229-.411-4.848-5.254-.247-1.929.335-6.368 3.767-6.368ZM52.973 84.181l.911 13.372M53.8 91.197l8.277-1.635M62.077 82.602l.317 12.543"
					style="fill:none;stroke-width:1.5px"
				/><path
					d="M73.993 27.547c1.616 0 2.505 1.705 2.505 3.936 0 2.23-1.523 4.2-3.139 4.2-1.616 0-2.717-1.97-2.717-4.2 0-2.231 1.734-3.936 3.351-3.936ZM94.369 29.447c1.617 0 2.506 1.705 2.506 3.936s-.889 4.2-2.506 4.2c-1.616 0-3.35-1.969-3.35-4.2s1.734-3.936 3.35-3.936Z"
				/><path
					d="M70.642 47.741s6.269 5.081 9.37 5.608c3.102.528 6.005 0 6.863-.527.858-.528 8.182-3.366 8.182-3.366M12.91 56.413s21.748 4.229 32.019 19.534M12.91 56.413l1.29 16.559M15.19 74.127c4.234 0 8.506 5.081 9.321 12.826.793 7.538-4.097 12.992-8.331 12.992-4.234 0-10.228-5.287-9.733-12.992.346-5.383 3.272-12.826 8.743-12.826ZM16.934 99.888l1.847 25.329M18.781 125.217c12.757 6.181 24.958 14.084 30.303 23.796M44.929 75.947l4.155 73.066M44.929 75.947s22.07-15.011 55.499-6.956M116.135 83.087s-23.301 3.711-26.188 16.858c-2.887 13.146 16.084 21.726 24.539 25.272M100.428 68.991l.64 18.999M102.893 119.522v22.725M102.893 142.247s-32.573-4.351-53.809 6.766"
					style="fill:none;stroke-width:2.83px"
				/><path
					d="M33.331 64.879s11.887-38.243 26.425-51.338c14.538-13.094 35.881-18.971 56.605 0 11.78 10.784 16.13 31.787 20.896 52.639 3.618 15.833 8.175 31.579 12.36 42.698 9.565 25.413 15.82 40.135 15.82 40.135M165.437 149.013s-9.596.123-15.82 7.65-20.463 6.862-20.463 6.862l3.001 12.625s-18.868 11.651-34.953 10.413c-16.084-1.237-18.559-13.506-39.386-10.413s-41.139-11.96-56.399-31.963M1.417 144.187s12.74-19.984 16.658-28.645M123.185 138.413l8.97 37.737"
					style="fill:none;stroke-width:2.83px"
				/></svg
			>
		</div>
	</div>
</div>
