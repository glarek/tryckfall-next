<script lang="ts">
	import GalleryVerticalEndIcon from '@lucide/svelte/icons/gallery-vertical-end';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const id = $props.id();
</script>

<div class={cn('flex flex-col gap-6', className)} bind:this={ref} {...restProps}>
	<form method="POST" action="?/login">
		<div class="flex flex-col gap-6">
			<div class="flex flex-col items-center gap-2">
				<a href="##" class="flex flex-col items-center gap-2 font-medium">
					<div class="flex size-8 items-center justify-center rounded-md">
						<GalleryVerticalEndIcon class="size-6" />
					</div>
					<span class="sr-only">Acme Inc.</span>
				</a>
				<h1 class="text-xl font-bold">Logga in på tryckfall.nu</h1>
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
				<Button type="submit" class="w-full cursor-pointer">Logga in</Button>
				<Button
					type="submit"
					formaction="?/signup"
					class="text-muted-foreground hover:text-foreground hover:border-primary hover:bg-background bg-background border-foreground[1/2] border-1 w-full cursor-pointer"
					>Registrera</Button
				>
			</div>
			<div
				class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
			>
				<span class="bg-background text-muted-foreground relative z-10 px-2"> Eller </span>
			</div>
		</div>
	</form>
	<div
		class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
	>
		By clicking continue, you agree to our <a href="##">Terms of Service</a>
		and <a href="##">Privacy Policy</a>.
	</div>
</div>
