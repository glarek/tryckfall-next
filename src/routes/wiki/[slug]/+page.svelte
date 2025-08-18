<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	import { PenLine, Trash2, Wand } from '@lucide/svelte';

	import { Carta, Markdown } from 'carta-md';
	import '@cartamd/plugin-attachment/default.css';
	import { imsize } from 'carta-plugin-imsize';
	import { emoji } from '@cartamd/plugin-emoji';
	import { code } from '@cartamd/plugin-code';
	import { subscript } from 'carta-plugin-subscript';
	import 'carta-md/default.css'; /* Default theme */

	import '$lib/styles/github.scss';

	let { data } = $props();

	console.log(data.post);

	//let slug = $state(params.slug || '');

	const carta = new Carta({
		sanitizer: false,
		gfmOptions: {
			singleTilde: false
		},
		extensions: [imsize(), emoji(), code(), subscript()]
	});

	const isUserAdmin = data?.role === 'admin';
</script>

<div class="markdown relative">
	{#if isUserAdmin}
		<div class=" relative font-mono text-sm bg-muted w-fit p-1 rounded-md pb-3 mb-2">
			{data.post.category} > {data.post.title}<br />
			<span class="absolute -pt-2 text-[8px] text-foreground/50">{data.time}</span>
		</div>
	{/if}

	<Markdown {carta} value={data.post.content} />
	{#if isUserAdmin}
		<a
			transition:scale
			href={`/wiki/${data.slug}/edit`}
			class="absolute top-0 right-0 bg-primary rounded-full p-2"><PenLine /></a
		>
	{/if}
</div>
