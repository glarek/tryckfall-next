<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';

	import { enhance } from '$app/forms';

	let logIn = $state(false);

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const id = $props.id();
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form
		method="POST"
		use:enhance={() => {
			logIn = true;

			return async ({ update }) => {
				await update();
			};
		}}
		action="?/login"
	>
		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-2">
				<a href="##" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex items-center justify-center rounded-md mb-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							xml:space="preserve"
							stroke="currentColor"
							fill="currentColor"
							width={167}
							style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5"
							viewBox="0 0 167 205"
							><path
								d="M73.991 43.583c1.616 0 2.505 1.705 2.505 3.936 0 2.23-1.523 4.2-3.139 4.2-1.616 0-2.717-1.97-2.717-4.2 0-2.231 1.734-3.936 3.351-3.936ZM94.367 45.483c1.617 0 2.506 1.705 2.506 3.936s-.889 4.2-2.506 4.2c-1.616 0-3.35-1.969-3.35-4.2s1.734-3.936 3.35-3.936Z"
							/><path
								d="M70.64 63.777c8.011 6.205 17.697 5.82 24.415 1.715M1.415 160.223c10.021-10.455 31.571-28.762 33.753-55.267 2.835-34.439 5.683-58.144 24.586-75.379a54.112 54.112 0 0 1 4.953-4.015M115.001 28.37c.453.39.906.793 1.358 1.207 11.78 10.784 16.13 31.787 20.896 52.639 3.618 15.833 8.175 31.579 12.36 42.698 9.565 25.413 15.82 40.135 15.82 40.135M1.415 160.223s9.596 4.949 15.82 12.476c6.224 7.527 20.463 6.862 20.463 6.862l-3.001 12.625s18.868 11.651 34.953 10.413c16.084-1.237 18.559-13.506 39.386-10.413s41.139-7.134 56.399-27.137M43.667 154.449l-8.97 37.737M56.537 83.075c5.625-2.884 12.684-3.747 13.162-3.476 1.581.897.361 2.018.561 12.899.071 3.902.341 6.784-.499 7.731-1.302 1.467-3.092 1.454-7.623 1.862M66.806 102.486c-.794 3.255-1.059 3.322-4.187 4.509-1.372.521-2.584 4.346-5.005 4.844-5.094 1.048-4.797 1.831-9.822 2.957"
								style="fill:none;stroke-width:2.83px"
							/><path
								d="M66.513 86.826c-1.49.283-1.453.294-2.911.764M66.698 93.108l-.943.378M64.853 30.746s-.153-2.213-.146-5.184"
								style="fill:none;stroke-width:2.83px"
							/><path
								d="M64.707 25.562c.008-3.554.245-8.193 1.246-11.427C67.791 8.198 77.5 2.998 85.385 1.769c7.885-1.229 15.221.835 21.709 5.088 5.571 3.652 10.334 12.513 7.907 21.513M115.001 28.37a19.52 19.52 0 0 1-1.81 4.432"
								style="fill:none;stroke-width:2.83px"
							/><path
								d="M64.853 30.746s-2.983 7.009-2.01 8.578c.973 1.569 14.114-12.556 24.381-8.697 10.267 3.858 17.487 12.142 23.059 10.766 5.573-1.375 3.856-6.916 2.908-8.591-.949-1.674-17.997-9.566-28.894-9.229-13.054.404-19.444 7.173-19.444 7.173Z"
								style="fill:none;stroke-width:2.83px"
							/><path
								d="M82.621 18.663c-1.052-6.481-1.124-11.544 7.557-11.624 8.866-.081 8.31 3.726 7.728 7.267-.549 3.347-2.913 6.128-2.913 6.128-3.006-1.888-4.452-2.437-12.372-1.771Z"
								style="fill:none;stroke-width:1.43px"
							/><path
								d="M52.36 82.098c4.234 0 8.506 5.081 9.321 12.826.793 7.538-4.097 12.992-8.331 12.992-4.234 0-10.228-5.287-9.733-12.992.346-5.383 3.272-12.826 8.743-12.826ZM120.957 110.244c-25.176 5.577-10.677 37.282 10.795 17.708"
								style="fill:none;stroke-width:2.83px"
							/></svg
						>
					</div>
					<span class="sr-only">Acme Inc.</span>
				</a>
				<h1 class="text-xl">
					Logga in på <span
						class=" decoration-primary decoration-wavy underline decoration-1 underline-offset-2"
						>tryckfall.nu</span
					>
				</h1>
				<div class="text-center text-sm">
					Saknar du konto?
					<a href="##" class="underline underline-offset-4"> Registrera </a>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<Label for="email-{id}">E-post</Label>
					<Input id="email-{id}" type="email" name="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-3">
					<Label for="password-{id}">Lösenord</Label>
					<Input id="password-{id}" name="password" type="password" required />
				</div>
				<Button type="submit" class="w-full cursor-pointer">
					{#if logIn}Loggar in
						<div
							class="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"
						></div>{:else}Logga in{/if}</Button
				>
			</div>
			<div class="border-b-1"></div>
		</div>
	</form>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		Genom att logga in godkänner du att du är snäll och inte vill jävlas.
	</div>
</div>
