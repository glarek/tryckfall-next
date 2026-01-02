<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { Plus, ChevronRight } from '@lucide/svelte';
	import { wikiStore } from '$lib/stores/wiki.svelte';
	import { auth } from '$lib/stores/auth.svelte';
	import * as Accordion from '$lib/components/ui/accordion/index.js';

	onMount(() => {
		wikiStore.fetchMenu();
	});
</script>

<div class="grid grid-rows-1 gap-10 border-b-1 border-dashed p-4 md:grid-cols-[3fr_167px]">
	<div class="order-2 md:order-1">
		<h1>Enkel information för <mark>VVS</mark> och <mark>energi.</mark></h1>
		<p>
			Dessa dokument innehåller erfarenhetsbaserad information och tumregler inom VVS och energi.
			Innehållet är inte granskat eller kvalitetskontrollerat och ska betraktas som vägledande.
		</p>
		<p>
			Dokumentet uppdateras kontinuerligt. Förslag till ändringar och kompletteringar kan skickas
			till
			<span class="email"
				><a href="mailto:adrian.larek@gritprojects.se">adrian.larek@gritprojects.se</a></span
			>.
		</p>
	</div>
	<div class="order-1 mt-2 mb-4 justify-self-center md:order-2">
		<svg
			fill="currentColor"
			stroke="currentColor"
			width="167"
			xmlns="http://www.w3.org/2000/svg"
			xml:space="preserve"
			style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5"
			viewBox="0 0 167 189"
			><path
				d="M78.195 81.206c.83 5.014 2.347 7.513 3.245 9.659 1.494-1.947 3.081-3.832 3.829-7.678 1.572 2.834 3.179 6.661 4.519 7.682 1.045-3.638 2.698-12.154 2.698-12.154M60.289 103.058c2.999-.286 6.749-.668 9.481-1.679"
				style="fill:none;stroke-width:1.5px"
			/><path
				d="M65.466 102.437c-.39 4.541-.021 8.635 0 12.699M71.931 107.202c.006-4.453 3.909-7.532 6.875-4.78 4.306 3.996 2.568 9.624-.976 11.208-2.453 1.097-5.904-3.047-5.899-6.428ZM58.526 122.996c2.5 3.654 3.826 7.428 5.772 12.48 1.204-4.176 1.85-9.759 3.304-15.023M70.615 120.145c2.358 4.599 2.598 8.326 4.743 14.106 1.293-3.167 1.731-7.868 3.365-14.659M88.783 119.592c-1.727-.005-6.008.29-6.994 3.252-1.086 3.266 4.476 2.126 6.994 5.272 3.06 3.824-3.57 8.552-8.155 4.57M70.936 81.053c3.668 0 3.874 4.431 4.054 6.368.18 1.937.121 5.22-2.973 5.254-1.304.014-4.229-.411-4.848-5.254-.247-1.929.335-6.368 3.767-6.368ZM52.971 84.179l.911 13.372M53.798 91.195l8.277-1.635M62.075 82.6l.317 12.543"
				style="fill:none;stroke-width:1.5px"
			/><path
				d="M73.991 27.545c1.616 0 2.505 1.705 2.505 3.936 0 2.23-1.523 4.2-3.139 4.2-1.616 0-2.717-1.97-2.717-4.2 0-2.231 1.734-3.936 3.351-3.936ZM94.367 29.445c1.617 0 2.506 1.705 2.506 3.936s-.889 4.2-2.506 4.2c-1.616 0-3.35-1.969-3.35-4.2s1.734-3.936 3.35-3.936Z"
			/><path
				d="M70.64 47.739s6.269 5.081 9.37 5.608c3.102.528 6.005 0 6.863-.527.858-.528 8.182-3.366 8.182-3.366M12.908 56.411s21.748 4.229 32.019 19.534M12.908 56.411l1.29 16.559M15.188 74.125c4.234 0 8.506 5.081 9.321 12.826.793 7.538-4.097 12.992-8.331 12.992-4.234 0-10.228-5.287-9.733-12.992.346-5.383 3.272-12.826 8.743-12.826ZM16.932 99.886l1.847 25.329M18.779 125.215c12.757 6.181 24.958 14.084 30.303 23.796M44.927 75.945l4.155 73.066M44.927 75.945s22.07-15.011 55.499-6.956M116.133 83.085s-23.301 3.711-26.188 16.858c-2.887 13.146 16.084 21.726 24.539 25.272M100.426 68.989l.64 18.999M102.891 119.52v22.725M102.891 142.245s-32.573-4.351-53.809 6.766"
				style="fill:none;stroke-width:2.83px"
			/><path
				d="M33.329 64.877s11.887-38.243 26.425-51.338c14.538-13.094 35.881-18.971 56.605 0 11.78 10.784 16.13 31.787 20.896 52.639 3.618 15.833 8.175 31.579 12.36 42.698 9.565 25.413 15.82 40.135 15.82 40.135M165.435 149.011s-9.596.123-15.82 7.65-20.463 6.862-20.463 6.862l3.001 12.625s-18.868 11.651-34.953 10.413c-16.084-1.237-18.559-13.506-39.386-10.413s-41.139-11.96-56.399-31.963M1.415 144.185s12.74-19.984 16.658-28.645M123.183 138.411l8.97 37.737"
				style="fill:none;stroke-width:2.83px"
			/></svg
		>
	</div>
</div>

{#if wikiStore.isLoading}
	<div class="p-4">Laddar...</div>
{:else if wikiStore.error}
	<div class="p-4 text-red-500">{wikiStore.error}</div>
{:else if wikiStore.categories.length === 0}
	<div class="flex flex-col flex-wrap divide-y-1 divide-dashed border-b-1 border-dashed p-4">
		<h2 class="text-red-500">Hittade inga sidor</h2>
	</div>
{:else}
	<div class="flex flex-col flex-wrap divide-y-1 divide-dashed border-b-1 border-dashed">
		<Accordion.Root type="multiple">
			{#each wikiStore.categories as category}
				<Accordion.Item value={category.id.toString()}>
					<Accordion.Trigger
						class="decoration-input inline-flex items-center px-4 underline-offset-5 hover:underline"
					>
						{#snippet children()}
							<h2>{category.name}</h2>
						{/snippet}
					</Accordion.Trigger>
					<Accordion.Content class="px-4">
						{#snippet children()}
							<ul class="mt-2">
								{#each category.articles as article}
									<li
										class="text-muted-foreground hover:text-foreground hover:border-foreground ml-2 border-l-2 pl-4"
									>
										<a href="/wiki/article/{article.slug}">{article.title}</a>
									</li>
								{/each}
							</ul>
						{/snippet}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
{/if}

{#if auth.user?.role === 'admin'}
	<div class="flex flex-col">
		<a href="/wiki/skapa-sida">
			<button
				class="hover:text-primary center inline-flex w-full cursor-pointer items-center gap-x-2 border-b-1 border-dashed p-4"
			>
				<Plus />
				<h2>Skapa ny sida</h2>
			</button>
		</a>

		<a href="skapa-kategori">
			<button
				class="hover:text-primary inline-flex w-full cursor-pointer items-center gap-x-2 border-b-1 border-dashed p-4"
			>
				<Plus />
				<h2>Skapa ny kategori</h2>
			</button>
		</a>
	</div>
{/if}
