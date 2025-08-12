<script lang="ts">
	import { getPost } from './edit.remote.js';
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

	let { params } = $props();

	const postPromise = getPost(params.slug);

	let slug = $state(params.slug || '');

	let isUserAdmin = $state(false);

	const carta = new Carta({
		sanitizer: false,
		gfmOptions: {
			singleTilde: false
		},
		extensions: [imsize(), emoji(), code(), subscript()]
	});

	onMount(() => {
		// This fetch happens only in the browser.
		fetch('/api/check-admin')
			.then((res) => res.json())
			.then((authData) => {
				if (authData.isUserAdmin) {
					isUserAdmin = true;
				}
			});
	});
</script>

{#await postPromise}
	Laddar...
{:then post}
	Titeln är {post.Title}
	<div class="markdown relative">
		<Markdown {carta} value={post.content} />
		{#if isUserAdmin}
			<a
				transition:scale
				href={`/wiki/${slug}/edit`}
				class="absolute top-0 right-0 bg-primary rounded-full p-2"><PenLine /></a
			>
		{/if}
	</div>
{/await}
