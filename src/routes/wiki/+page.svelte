<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	import { SquarePlus, ChevronRight } from '@lucide/svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let groups = $state(
		data.groupedPages.map((group) => ({
			...group,
			shown: false
		}))
	);
</script>

{#if data.groupedPages.length === 0}
	<p>Hittade inga sidor.</p>
{:else}
	<div class="flex flex-wrap flex-col divide-y-1 divide-dashed">
		{#each groups as group}
			<div class="p-4">
				<button class="cursor-pointer" on:click={() => (group.shown = !group.shown)}>
					<h2 class=" inline-flex items-center" id={group.categoryTitle.toLowerCase()}>
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

<div class="grid grid-cols-[1fr_1fr] w-fit gap-x-6">
	<a href="./skapa-sida">
		<Button variant="outline" class="my-4 cursor-pointer w-full ">
			<SquarePlus />
			Skapa ny sida
		</Button>
	</a>

	<a href="./skapa-kategori">
		<Button variant="outline" class="my-4 cursor-pointer w-full">
			<SquarePlus />
			Skapa ny kategori
		</Button>
	</a>
</div>
