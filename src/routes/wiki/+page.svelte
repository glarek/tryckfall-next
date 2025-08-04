<script lang="ts">
	// Importera typerna för bättre autokomplettering och säkerhet
	import type { PageData } from './$types';

	// Den nya metoden med Svelte 5 Runes
	const { data } = $props<{ data: PageData }>();
</script>

<h1>Blogg</h1>

<div class="posts-grid">
	{#each data.posts as post (post._id)}
		<a href="/wiki/{post.slug.current}" class="post-card">
			<h2>{post.title}</h2>
			{#if post.publishedAt}
				<p>Publicerad: {new Date(post.publishedAt).toLocaleDateString()}</p>
			{/if}
		</a>
	{/each}
</div>

<style>
	.posts-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}
	.post-card {
		border: 1px solid #ccc;
		padding: 1rem;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s ease-in-out;
	}
	.post-card:hover {
		transform: translateY(-5px);
	}
</style>
