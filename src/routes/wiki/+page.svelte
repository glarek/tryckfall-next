<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	import { SquarePlus } from '@lucide/svelte';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

{#if data.groupedPages.length === 0}
	<p>Hittade inga sidor.</p>
{:else}
	{#each data.groupedPages as group}
		<Card.Root class="gap-0 w-full max-w-sm">
			<Card.Header>
				<Card.Title>
					<h2 id={group.categoryTitle.toLowerCase()}>{group.categoryTitle}</h2>
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<ul>
					{#each group.pages as page}
						<li
							class="pl-4 text-muted-foreground hover:text-foreground hover:border-foreground border-l-2"
						>
							<a href="/wiki/{page.slug}">{page.title}</a>
						</li>
					{/each}
				</ul></Card.Content
			>
		</Card.Root>
	{/each}
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
