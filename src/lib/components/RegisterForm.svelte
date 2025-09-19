<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { registerSchema } from '$lib/schemas';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import { slide } from 'svelte/transition';

	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Password from '$lib/components/ui/password';
	import { cn, type WithElementRef } from '$lib/utils.js';

	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/SuperDebug.svelte';

	let logIn = $state(false);

	let {
		formData,
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { formData } = $props();

	let { form, errors, constraints, message, enhance } = superForm(formData, {
		taintedMessage: 'Fyll i alla fält korrekt',
		validators: zod4(registerSchema),
		onSubmit: () => (logIn = true)
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
				class=" decoration-primary decoration-wavy underline decoration-1 underline-offset-2"
				>tryckfall.nu</span
			>
		</h1>
		<div class="text-center text-muted-foreground text-sm">
			Har du redan konto?
			<a href="/auth" class=" hover:text-primary cursor-pointer underline underline-offset-2">
				Logga in
			</a>
		</div>
	</div>
	<form method="POST" use:enhance action="?/signup">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<Label for="email">E-post</Label>
					<Input
						id="email"
						type="email"
						name="email"
						placeholder="m@example.com"
						required
						bind:value={$form.email}
						{...$constraints.email}
					/>
					{#if $errors.email}
						<small transition:slide class="error-message">{$errors.email}</small>
					{/if}
				</div>
				<div class="grid grid-cols-[1fr_1fr] gap-3">
					<Label for="firstName">Förnamn</Label>
					<Label for="lastName">Efternamn</Label>
					<div class="flex flex-col">
						<Input
							type="text"
							name="firstName"
							placeholder="Ditt förnamn"
							required
							bind:value={$form.firstName}
							{...$constraints.firstName}
						/>
						{#if $errors.firstName}
							<small transition:slide class="error-message">{$errors.firstName}</small>
						{/if}
					</div>

					<div class="flex flex-col">
						<Input
							type="text"
							name="lastName"
							placeholder="Ditt efternamn"
							required
							bind:value={$form.lastName}
							{...$constraints.lastName}
						/>
						{#if $errors.lastName}
							<small transition:slide class="error-message">{$errors.lastName}</small>
						{/if}
					</div>
				</div>
				<div class="grid gap-3">
					<Label for="password">Lösenord</Label>
					<div class="flex w-full flex-col gap-2">
						<Password.Root minScore={0} class="w-full">
							<Password.Input
								name="password"
								autocomplete="new-password"
								bind:value={$form.password}
								{...$constraints.password}
							>
								<Password.ToggleVisibility />
							</Password.Input>
							<Password.Strength />
						</Password.Root>
						{#if $errors.password}
							<small transition:slide class="error-message">{$errors.password}</small>
						{/if}
					</div>
					<div class="flex w-full flex-col gap-2">
						<Label for="repeat-password-{id}">Upprepa lösenord</Label>
						<Input
							name="repeatPassword"
							type="password"
							required
							bind:value={$form.repeatPassword}
						/>
						{#if $errors.repeatPassword}
							<small transition:slide class="error-message">{$errors.repeatPassword}</small>
						{/if}
					</div>
				</div>
				<Button type="submit" class="w-full cursor-pointer">
					{#if logIn}Loggar in
						<div
							class="w-4 h-4 border-2 dark:border-foreground border-background border-t-transparent dark:border-t-transparent rounded-full animate-spin"
						></div>{:else}Logga in{/if}</Button
				>
			</div>
			<div class="border-b-1"></div>
		</div>
	</form>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		Genom att registrera dig godkänner du att du är snäll och inte vill jävlas.
	</div>
</div>
