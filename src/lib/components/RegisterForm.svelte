<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { registerSchema } from '$lib/schemas';
	import { goto } from '$app/navigation';
	import { authApi } from '$lib/api/auth';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { handleApiError } from '$lib/utils/apiResponseHandler';
	import { TriangleAlert } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	let loading = $state(false);
	// error represents a general form error (like API failure)
	let error = $state<string | null>(null);
	// errors represents validation errors for specific fields
	let validationErrors = $state<Record<string, string>>({});

	let formData = $state({
		email: '',
		first_name: '',
		last_name: '',
		password: '',
		repeatPassword: ''
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		loading = true;
		error = null;
		validationErrors = {};

		const result = registerSchema.safeParse(formData);

		if (!result.success) {
			const fieldErrors = result.error.flatten().fieldErrors;
			for (const [key, value] of Object.entries(fieldErrors)) {
				if (value) validationErrors[key] = value[0];
			}
			loading = false;
			return;
		}

		try {
			await authApi.register(result.data);
			// Success flow - maybe redirect to login or a "verify email" page?
			// The API docs say: verify email link is sent.
			// Let's redirect to login with a query param or just /auth
			// Ideally we would show a success message, but user asked for "like login form"
			// Login form redirects to /private. Here we probably want /auth (login page)
			// But maybe we should show a success message?
			// User said "remove toasters".
			// I'll stick to goto('/auth') as before, but maybe we can add a 'sucess' state to show a text?
			// For now, let's just redirect.
			await goto('/auth');
		} catch (err: any) {
			console.log({ err });
			error = handleApiError(err);
		} finally {
			loading = false;
		}
	}
</script>

{#snippet field(
	name: keyof typeof formData,
	label: string,
	type: string = 'text',
	placeholder?: string,
	required: boolean = false
)}
	<div class="grid gap-2">
		<Label for={name}>{label}</Label>
		<Input id={name} {type} {name} {placeholder} {required} bind:value={formData[name]} />
		{#if validationErrors[name]}<p class="text-destructive text-xs">
				{validationErrors[name]}
			</p>{/if}
	</div>
{/snippet}

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<div class="flex flex-col items-center gap-2">
		<svg
			class="mb-10"
			width="219"
			height="81"
			xmlns="http://www.w3.org/2000/svg"
			xml:space="preserve"
			style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5"
			viewBox="0 0 219 81"
			stroke="currentColor"
			><path
				d="M113.853 78.616s-10.217-48.814-13.708-66.801c32.809-15.13 80.037-2.209 103.746-10.398 16.046 32.636 13.411 66.427 13.174 66.377-18.655-3.911-61.066-10.029-103.212 10.822Z"
				style="fill:none;stroke-width:2.83px"
			/><path
				d="M100.372 11.782c43.531 15.418 59.852 37.727 59.852 37.727s22.038-13.1 43.667-48.092M87.573 32.225c-36-10.538-36.277 26.041-86.156 28.535M87.573 61.144c-28.699-5.527-23.541 13.163-62.28 17.472"
				style="fill:none;stroke-width:2.83px"
			/></svg
		>
		<h1 class="text-xl">
			Registrera dig på <span
				class=" decoration-primary underline decoration-wavy decoration-1 underline-offset-2"
				>tryckfall.nu</span
			>
		</h1>
		<div class="text-muted-foreground text-center text-sm">
			Har du redan konto?
			<a href="/auth" class=" hover:text-primary cursor-pointer underline underline-offset-2">
				Logga in
			</a>
		</div>
	</div>
	<form onsubmit={handleSubmit}>
		<div class="grid gap-4">
			<div class="grid grid-cols-2 gap-4">
				{@render field('first_name', 'Förnamn', 'text', 'Max', true)}
				{@render field('last_name', 'Efternamn', 'text', 'Robinson', true)}
			</div>

			{@render field('email', 'E-post', 'email', 'm@exempel.com', true)}
			{@render field('password', 'Lösenord', 'password')}
			{@render field('repeatPassword', 'Bekräfta Lösenord', 'password')}

			<Button type="submit" class="w-full " disabled={loading}>
				{#if loading}
					Skapar konto...
				{:else}
					Skapa ett konto
				{/if}
			</Button>
			{#if error}
				<Alert variant="destructive">
					<TriangleAlert class="size-4" />
					<AlertTitle>Registreringsfel!</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			{/if}
		</div>
		<div class="mt-4 text-center text-sm">
			Har du redan ett konto?
			<a href="/auth" class="underline"> Logga in </a>
		</div>
	</form>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
	>
		Genom att registrera dig godkänner du att du är snäll och inte vill jävlas.
	</div>
</div>
