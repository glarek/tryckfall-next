<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	import { Plus, ChevronRight } from '@lucide/svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let groups = $state(
		data.groupedPages.map((group) => ({
			...group,
			shown: false
		}))
	);
</script>

<div class="p-4 border-b-1 border-dashed">
	<h1>Enkel information för <mark>VVS</mark> och <mark>energi.</mark></h1>
	<p>
		Dessa dokument innehåller erfarenhetsbaserad information och tumregler inom VVS och energi.
		Innehållet är inte granskat eller kvalitetskontrollerat och ska betraktas som vägledande.
	</p>
	<p>
		Dokumentet uppdateras kontinuerligt. Förslag till ändringar och kompletteringar kan skickas till
		<span class="email"
			><a href="mailto:adrian.larek@gritprojects.se">adrian.larek@gritprojects.se</a></span
		>.
	</p>
</div>

{#if data.groupedPages.length === 0}
	<div class="flex flex-wrap flex-col divide-y-1 divide-dashed border-b-1 border-dashed p-4">
		<h2 class="text-red-500">Hittade inga sidor</h2>
	</div>
{:else}
	<div class="flex flex-wrap flex-col divide-y-1 divide-dashed border-b-1 border-dashed">
		{#each groups as group}
			<div class="p-4">
				<button class="cursor-pointer" onclick={() => (group.shown = !group.shown)}>
					<h2
						class="hover:underline decoration-input underline-offset-5 inline-flex items-center"
						id={group.categoryTitle.toLowerCase()}
					>
						{group.categoryTitle}<ChevronRight
							class="ml-1 {group.shown ? 'rotate-90 transition-transform' : 'transition-transform'}"
						/>
					</h2>
				</button>

				{#if group.shown}
					<ul class="mt-2" transition:slide>
						{#each group.pages as page}
							<li
								class="ml-2 pl-4 text-muted-foreground hover:text-foreground hover:border-foreground border-l-2"
							>
								<a href="/wiki/{page.slug}">{page.title}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<div class="flex flex-col">
	<a href="/wiki/skapa-sida">
		<button
			class="hover:text-primary p-4 inline-flex gap-x-2 items-center center cursor-pointer w-full border-b-1 border-dashed"
		>
			<Plus />
			<h2>Skapa ny sida</h2>
		</button>
	</a>

	<a href="skapa-kategori">
		<button
			class="hover:text-primary p-4 inline-flex gap-x-2 items-center cursor-pointer w-full border-b-1 border-dashed"
		>
			<Plus />
			<h2>Skapa ny kategori</h2>
		</button>
	</a>
</div>
