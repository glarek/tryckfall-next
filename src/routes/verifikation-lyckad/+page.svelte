<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { authApi } from '$lib/api/auth';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Loader2, CheckCircle, XCircle } from '@lucide/svelte';
	import { handleApiError } from '$lib/utils/apiResponseHandler';

	let status = $state<'loading' | 'success' | 'error'>('loading');
	let message = $state<string>('Verifierar din e-postadress...');
	let errorDetails = $state<string | null>(null);

	onMount(async () => {
		const token = $page.url.searchParams.get('token');

		if (!token) {
			status = 'error';
			message = 'Ingen verifieringskod hittades.';
			errorDetails = 'Kontrollera länken och försök igen.';
			return;
		}

		try {
			await authApi.verify(token);
			status = 'success';
			message = 'Din e-postadress har verifierats!';
		} catch (err: any) {
			status = 'error';
			message = 'Verifieringen misslyckades.';
			errorDetails = handleApiError(err);
		}
	});
</script>

<div class="flex h-screen w-full flex-col items-center justify-center p-4">
	<div class="mb-4 flex w-fit justify-center">
		{#if status === 'loading'}
			<Loader2 class="text-primary h-16 w-16 animate-spin" />
		{:else if status === 'success'}
			<CheckCircle class="h-16 w-16 text-green-500" />
		{:else}
			<XCircle class="text-destructive h-16 w-16" />
		{/if}
	</div>
	{#if status === 'loading'}
		Verifierar...
	{:else if status === 'success'}
		Verifiering lyckades!
	{:else}
		Något gick fel
	{/if}

	{message}

	{#if errorDetails}
		<p class="text-muted-foreground text-sm">{errorDetails}</p>
	{/if}
	{#if status === 'success'}
		<p class="text-muted-foreground text-sm">Ditt konto är nu aktiverat och du kan logga in.</p>
	{/if}

	{#if status === 'success'}
		<Button onclick={() => goto('/auth')} class="w-full">Gå till inloggning</Button>
	{:else if status === 'error'}
		<Button variant="outline" onclick={() => goto('/auth')} class="w-full">
			Tillbaka till inloggning
		</Button>
	{/if}
</div>
