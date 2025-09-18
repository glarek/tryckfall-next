<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Password from '$lib/components/ui/password';
	import { cn, type WithElementRef } from '$lib/utils.js';

	import { enhance } from '$app/forms';

	import { superForm } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms/SuperDebug.svelte';

	let logIn = $state(false);

	let {
		data,
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { data: any } = $props();

	let { form } = superForm(data.form);

	const id = $props.id();
</script>

<SuperDebug data={form} />

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<div class="flex flex-col items-center gap-2">
		<h1 class="text-xl">
			Registrera dig på <span
				class=" decoration-primary decoration-wavy underline decoration-1 underline-offset-2"
				>tryckfall.nu</span
			>
		</h1>
		<div class="text-center text-sm">
			Har du redan konto?
			<a href="/auth" class="hover:text-primary cursor-pointer underline underline-offset-4">
				Logga in
			</a>
		</div>
	</div>
	<form
		method="POST"
		use:enhance={() => {
			logIn = true;
			return async ({ update }) => {
				await update();
			};
		}}
		action="?/register"
	>
		<div class="flex flex-col gap-6">
			<div class="flex flex-col gap-6">
				<div class="grid gap-3">
					<Label for="email">E-post</Label>
					<Input id="email" type="email" name="email" placeholder="m@example.com" required />
				</div>
				<div class="grid grid-cols-[1fr_1fr] gap-3">
					<Label for="first-name-{id}">Förnamn</Label>
					<Label for="last-name-{id}">Efternamn</Label>
					<Input
						id="first-name-{id}"
						type="text"
						name="first-name"
						placeholder="Ditt förnamn"
						required
					/>
					<Input
						id="last-name-{id}"
						type="text"
						name="last-name"
						placeholder="Ditt efternamn"
						required
					/>
				</div>
				<div class="grid gap-3">
					<Label for="password-{id}">Lösenord</Label>
					<div class="flex w-full flex-col gap-2">
						<Password.Root class="w-full">
							<Password.Input
								id="new-password-{id}"
								name="new-password"
								autocomplete="new-password"
							>
								<Password.ToggleVisibility />
							</Password.Input>
							<Password.Strength />
						</Password.Root>
					</div>
					<div class="flex w-full flex-col gap-2">
						<Label for="repeat-password-{id}">Upprepa lösenord</Label>
						<Input
							id="repeat-password-{id}"
							name="repeat-password"
							type="password"
							required
							aria-invalid="true"
						/>
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
		Genom att logga in godkänner du att du är snäll och inte vill jävlas.
	</div>
</div>
