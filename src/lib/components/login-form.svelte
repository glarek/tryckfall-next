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
			<div class="grid gap-4 sm:grid-cols-2">
				<Button variant="outline" type="button" class="w-full cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
							fill="currentColor"
						/>
					</svg>
					Fortsätt med Apple
				</Button>
				<Button variant="outline" type="button" class="w-full cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
							fill="currentColor"
						/>
					</svg>
					Fortsätt med Google
				</Button>
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
