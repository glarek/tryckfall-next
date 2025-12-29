<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import { wikiApi } from '$lib/api/wiki';
	import { onMount } from 'svelte';
	import { adminApi as adminService } from '$lib/api/admin';

	let menu = $state<any[]>([]);
	let loading = $state(true);

	const logout = () => {
		auth.logout();
		goto('/');
	};

	// Check auth on mount (optional since layout might handle it, but good for local state)
	onMount(async () => {
		if (!auth.isAuthenticated) {
			goto('/auth');
			return;
		}

		try {
			const res = await wikiApi.getMenu();
			// API docs say: { status: "success", data: [...] }
			// client.ts returns data directly if I typed it right, but let's check response structure at runtime or assumption
			// checking wiki.ts: returns api.get<MenuResponse>('/wiki/menu').
			// MenuResponse interface is { status: string, data: Category[] }
			if (res.status === 'success') {
				menu = res.data;
			}
		} catch (e) {
			console.error('Failed to load menu', e);
		} finally {
			loading = false;
		}
	});

	async function handleDeleteCategory(id: number) {
		if (!confirm('Are you sure?')) return;
		try {
			await adminService.deleteCategory(id);
			// Refresh menu
			const res = await wikiApi.getMenu();
			if (res.status === 'success') menu = res.data;
		} catch (e) {
			alert('Failed to delete category');
		}
	}

	let { data } = $props();
</script>

<div class="p-6">
	<div class="mb-6 flex items-center justify-between">
		<h1>Välkommen {auth.user?.name || 'Användare'}!</h1>
		<Button onclick={logout} variant="outline">Logga ut</Button>
	</div>
	<hr class="my-4" />

	{#if auth.user?.role === 'admin'}
		<div class="space-y-4">
			<h2 class="text-2xl font-bold">Admin Panel</h2>
			<p>Hantera kategorier och artiklar.</p>

			<div class="rounded-lg border p-4">
				<h3 class="mb-2 font-semibold">Befintliga Kategorier</h3>
				{#if loading}
					<p>Laddar...</p>
				{:else if menu.length === 0}
					<p>Inga kategorier hittades.</p>
				{:else}
					<ul class="space-y-2">
						{#each menu as cat}
							<li class="bg-muted/50 flex items-center justify-between rounded p-2">
								<span>{cat.name} (ID: {cat.id})</span>
								<div class="flex gap-2">
									<!-- Placeholder for edit/delete -->
									<Button
										variant="ghost"
										size="sm"
										class="text-red-500"
										onclick={() => handleDeleteCategory(cat.id)}>Ta bort</Button
									>
								</div>
							</li>
							{#if cat.articles}
								<ul class="mb-2 ml-4 space-y-1">
									{#each cat.articles as art}
										<li class="text-muted-foreground flex justify-between text-sm">
											<span>- {art.title}</span>
										</li>
									{/each}
								</ul>
							{/if}
						{/each}
					</ul>
				{/if}
			</div>

			<div class="mt-6">
				<!-- Links or form to create new content could go here -->
				<p class="text-muted text-sm">
					För att lägga till innehåll, använd Create Category/Article funktioner (ej implementerade
					i UI än).
				</p>
			</div>
		</div>
	{:else}
		<p>Du är inloggad som gäst.</p>
	{/if}
</div>
