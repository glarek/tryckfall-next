<script lang="ts">
	import { urlFor } from '$lib/sanity';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import { processSvg } from '$lib/svgUtils';

	let node = $props();
	const value = node.portableText?.value;
	let altText = $derived(value?.alt || 'Image');
	let isSvg = value.asset.mimeType === 'image/svg+xml';
	let svgContent = $state('');

	onMount(async () => {
		if (isSvg) {
			try {
				const response = await fetch(value.asset.url); // Använd den direkta URL:en vi fick
				if (response.ok) {
					const svgText = await response.text();
					// Sanera SVG-koden för säkerhet
					svgContent = processSvg(svgText);
				}
			} catch (error) {
				console.error('Kunde inte hämta SVG:', error);
			}
		}
	});
</script>

{#if value?.asset?.path}
	<figure class="my-6">
		{#if isSvg}
			{@html svgContent}
		{:else}
			<img src={urlFor(value.asset.url).auto('format').url()} alt={altText} loading="lazy" />
		{/if}
		{#if value?.caption}
			<figcaption class="mt-2 text-sm text-gray-600">{value.caption}</figcaption>
		{/if}
	</figure>
{:else}
	<div class="my-6 rounded bg-gray-100 p-4">
		<p class="text-gray-500">Bild kunde ej laddas</p>
	</div>
{/if}
