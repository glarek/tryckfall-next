<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { registerSchema } from '$lib/schemas';
	import { goto } from '$app/navigation';
	import { authApi } from '$lib/api/auth';

	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';
	import { toast } from 'svelte-sonner';

	let loading = $state(false);
	let formError = $state<string | null>(null);
	let errors = $state<Record<string, string>>({});

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	let formData = $state({
		email: '',
		username: '',
		firstName: '',
		lastName: '',
		password: '',
		repeatPassword: ''
	});

	const id = $props.id();
</script>

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
	<form method="POST" onsubmit={handleSubmit}>
		<div class="grid gap-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="grid gap-2">
					<Label for="first-name">Förnamn</Label>
					<Input
						id="first-name"
						name="firstName"
						placeholder="Max"
						required
						bind:value={formData.firstName}
					/>
					{#if errors.firstName}<p class="text-destructive text-xs">{errors.firstName}</p>{/if}
				</div>
				<div class="grid gap-2">
					<Label for="last-name">Efternamn</Label>
					<Input
						id="last-name"
						name="lastName"
						placeholder="Robinson"
						required
						bind:value={formData.lastName}
					/>
					{#if errors.lastName}<p class="text-destructive text-xs">{errors.lastName}</p>{/if}
				</div>
			</div>

			<div class="grid gap-2">
				<Label for="email">E-post</Label>
				<Input
					id="email"
					type="email"
					name="email"
					placeholder="m@exempel.com"
					required
					bind:value={formData.email}
				/>
				{#if errors.email}<p class="text-destructive text-xs">{errors.email}</p>{/if}
			</div>
			<div class="grid gap-2">
				<Label for="password">Lösenord</Label>
				<Input id="password" type="password" name="password" bind:value={formData.password} />
				{#if errors.password}<p class="text-destructive text-xs">{errors.password}</p>{/if}
			</div>
			<div class="grid gap-2">
				<Label for="confirm-password">Bekräfta Lösenord</Label>
				<Input
					id="confirm-password"
					type="password"
					name="confirmPassword"
					bind:value={formData.repeatPassword}
				/>
				{#if errors.confirmPassword}<p class="text-destructive text-xs">
						{errors.confirmPassword}
					</p>{/if}
			</div>
			{#if formError}
				<p class="text-destructive text-sm">{formError}</p>
			{/if}
			<Button type="submit" class="w-full " disabled={loading}>
				{#if loading}
					Skapar konto...
				{:else}
					Skapa ett konto
				{/if}
			</Button>
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
