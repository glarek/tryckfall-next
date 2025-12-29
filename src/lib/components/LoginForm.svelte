<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { goto } from '$app/navigation';
	import { authApi } from '$lib/api/auth';
	import { auth } from '$lib/stores/auth.svelte';
	import { handleApiError } from '$lib/utils/apiResponseHandler';
	import { TriangleAlert } from '@lucide/svelte';

	let loading = $state(false);
	let error = $state<string | null>(null);
	let email = $state('');
	let password = $state('');

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const id = $props.id();
</script>

<div class="flex flex-col items-center gap-2">
	<div class="mb-3 flex items-center justify-center rounded-md">
		<svg
			width="167"
			xmlns="http://www.w3.org/2000/svg"
			xml:space="preserve"
			style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5"
			viewBox="0 0 167 209"
			stroke="currentColor"
			fill="currentColor"
			><path
				d="M75.833 72.045S89.662 76.2 96.21 67.646"
				style="fill:none;stroke-width:2.83px"
			/><path
				d="M92.859 48.19c-1.616 0-2.505 1.705-2.505 3.936 0 2.23 1.523 4.2 3.139 4.2 1.616 0 2.717-1.97 2.717-4.2 0-2.231-1.734-3.936-3.351-3.936ZM72.483 50.09c-1.617 0-2.506 1.705-2.506 3.936s.889 4.2 2.506 4.2c1.616 0 3.35-1.969 3.35-4.2s-1.734-3.936-3.35-3.936Z"
			/><path
				d="M38.178 106.839s7.035-2.14 13.246-.943M51.424 105.896c2.201.425 4.298 1.268 5.943 2.774.435.4.839.846 1.205 1.343M58.572 110.013c.117.158.23.322.338.491.645 1.005 1.145 2.198 1.456 3.611 1.097 4.997-.624 7.95-3.643 9.885-.046.03-.091.059-.138.087M56.585 124.087c-.651.406-1.36.767-2.113 1.091-2.048.884-4.415 1.505-6.807 2.063M47.665 127.241c-3.397.791-6.842 1.456-9.487 2.565M1.415 169.656s9.596.123 15.82 7.65 20.463 6.862 20.463 6.862m5.969-25.112-8.97 37.737s18.868 11.651 34.953 10.413c16.084-1.237 18.559-13.506 39.386-10.413s41.139-11.96 56.399-31.963c0 0-13.846-25.989-20.186-39.273-1.795-3.763-3.882-8.529-6.172-13.937M130.865 91.853c-10.653-25.812-23.882-57.018-32.412-67.103M47.336 33.644c-9.699 11.384-13.375 34.078-17.741 53.179-3.618 15.833-8.175 31.579-12.36 42.698-9.565 25.413-15.82 40.135-15.82 40.135"
				style="fill:none;stroke-width:2.83px"
			/><path
				d="M139.077 111.62c-1.558 3.719-4.606 6.049-7.373 6.049-4.234 0-10.228-5.287-9.733-12.992.346-5.383 3.272-12.826 8.743-12.826l.151.002c4.184.119 8.365 5.171 9.17 12.824.275 2.611-.133 4.972-.958 6.943"
				style="fill:none;stroke-width:2.83px"
			/><path
				d="M47.336 33.644s6.128-3.458 10.313-4.237c0 0 10.707-6.618 20.732-8.078 10.026-1.46 18.688-.584 25.21 1.46 6.521 2.044 9.052 3.017 9.538 4.769.487 1.752-.097 3.504-3.893 3.309-3.796-.194-6.023.79-6.023.79"
				style="fill:none;stroke-width:2.7px"
			/><path
				d="M57.649 29.407s5.955 3.425 10.724 2.841c4.77-.584 12.362-5.159 18.202-6.23 5.84-1.07 13.832-1.913 18.575-.766 3.438.831 6.492 2.211 7.97 4.155"
				style="fill:none;stroke-width:2.7px"
			/><path
				d="M47.336 33.644S37.831 21.32 42.984 19.53c9.437-3.277 12.307-7.333 18.307-13.57 7.632-7.932 25.636-3.873 28.288-.737 3.504 4.143 8.784 5.163 9.855 6.813 1.792 2.763.073 9.539.073 9.539"
				style="fill:none;stroke-width:2.7px"
			/><path
				d="m72.246 8.334.759-2.642a.666.666 0 0 1 1.029-.354c1.546 1.123 2.516 1.879 2.756 2.065a25.14 25.14 0 0 1 3.973.096.661.661 0 0 1 .495.996 21.044 21.044 0 0 0-.891 1.784 30.652 30.652 0 0 1 2.261 2.229.663.663 0 0 1-.469 1.101 32.8 32.8 0 0 0-3.354.361c-.807 1.767-.921 2.068-1.5 3.285a.663.663 0 0 1-1.11.14 45.029 45.029 0 0 0-2.074-2.309 20.204 20.204 0 0 0-2.747 1.044.66.66 0 0 1-.943-.743c.156-.663.378-1.603.692-2.944a51.942 51.942 0 0 0-2.201-1.632.665.665 0 0 1 .049-1.122c1.507-.831 2.982-1.268 3.275-1.355Z"
			/><path
				d="M59.746 24.75s-2.731-4.303-3.255-9.078"
				style="fill:none;stroke-width:1.28px"
			/><path
				d="M71.76 46.525s3.081-.324 5.172 2.499M93.269 44.533s-3.065.444-4.396 3.696"
				style="fill:none;stroke-width:1.42px"
			/><path
				d="M49.8 105.657s-4.221-22.783-3.808-29.798c.469-7.977 12.888-8.29 13.827-.156.938 8.133-3.714 31.991-3.714 31.991"
				style="fill:none;stroke-width:2.83px"
			/></svg
		>
	</div>

	<h1 class="text-xl">
		Logga in på <span
			class=" decoration-primary underline decoration-wavy decoration-1 underline-offset-2"
			>tryckfall.nu</span
		>
	</h1>
	<div class="text-muted-foreground text-center text-sm">
		Saknar du konto?
		<a href="/auth/register" class="hover:text-primary cursor-pointer underline underline-offset-4">
			Registrera
		</a>
	</div>
</div>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form
		method="POST"
		onsubmit={async (e) => {
			e.preventDefault();
			loading = true;
			error = null;
			const formData = new FormData(e.currentTarget);
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;

			try {
				const response = await authApi.login(email, password);
				// Assuming response contains user and token as per earlier docs/implementation
				if (response.token && response.user) {
					auth.login(response.user, response.token);
					await goto('/private');
				} else {
					console.error('Login failed: Invalid response', response);
					error = handleApiError(response);
				}
			} catch (err: any) {
				console.log({ err });
				error = handleApiError(err);
			} finally {
				loading = false;
			}
		}}
	>
		<div class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">E-post</Label>
				<Input
					id="email"
					type="email"
					name="email"
					placeholder="namn@exempel.se"
					autocomplete="username"
					required
					bind:value={email}
				/>
			</div>
			<div class="grid gap-2">
				<div class="flex items-center">
					<Label for="password">Lösenord</Label>
					<a href="##" class="ml-auto inline-block text-sm underline"> Glömt ditt lösenord? </a>
				</div>
				<Input
					id="password"
					type="password"
					name="password"
					autocomplete="current-password"
					required
					bind:value={password}
				/>
			</div>
			{#if error}
				<Alert variant="destructive">
					<TriangleAlert class="size-4" />
					<AlertTitle>Inloggningsfel!</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			{/if}
			<Button type="submit" class="transition-all duration-300 " disabled={loading}>
				{#if loading}
					Loggar in...
				{:else}
					Logga in
				{/if}
			</Button>
		</div>
	</form>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
	>
		Genom att logga in godkänner du att du är snäll och inte vill jävlas.
	</div>
</div>
