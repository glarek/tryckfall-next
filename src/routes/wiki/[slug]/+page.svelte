<script lang="ts">
	import type { PageData } from './$types';
	import type { CustomBlockComponentProps } from '@portabletext/svelte';
	import { PortableText } from '@portabletext/svelte';
	import SanityImage from '$lib/components/SanityImage.svelte';

	interface Props {
		portableText: CustomBlockComponentProps<{ image?: string }>;
	}

	const { data } = $props<{ data: PageData }>();
</script>

<article class="p-6 self-center">
	<h1 class=" font-black">{data.post.title}</h1>

	<div class="content">
		{#if data.post.body}
			<PortableText value={data.post.body} components={{ types: { image: SanityImage } }} />
		{/if}
	</div>
</article>

<style>
	article {
		max-width: 600px;
	}
</style>
