<script lang="ts">
	import { scale } from 'svelte/transition';
	import { PenLine, Trash2, Wand } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	//let slug = $state(params.slug || '');

	let isUserAdmin = $state(false);

	onMount(() => {
		// Load any additional data if needed
		isUserAdmin = data?.role === 'admin';
	});
</script>

<div class="markdown relative m-6">
	{#if isUserAdmin}
		<div class=" relative font-mono text-sm bg-muted w-fit p-1 rounded-md pb-3 mb-2">
			{data.post.category} > {data.post.title}<br />
			<span class="absolute -pt-2 text-[8px] text-foreground/50">{data.time}</span>
		</div>
	{/if}

	{@html data?.HTMLContent}

	{#if isUserAdmin}
		<a
			transition:scale
			href={`/wiki/${data.slug}/edit`}
			class="absolute top-0 right-0 bg-primary rounded-full p-2"><PenLine /></a
		>
	{/if}
</div>
