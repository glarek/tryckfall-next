<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Wand, SquarePlus } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	import { Carta, MarkdownEditor, Markdown } from 'carta-md';
	import { attachment } from '@cartamd/plugin-attachment';
	import '@cartamd/plugin-attachment/default.css';
	import { imsize } from 'carta-plugin-imsize';
	import { emoji } from '@cartamd/plugin-emoji';
	import { code } from '@cartamd/plugin-code';
	import { subscript } from 'carta-plugin-subscript';
	import 'carta-md/default.css'; /* Default theme */

	import '$lib/styles/github.scss';

	import slugify from '@sindresorhus/slugify';
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	let lastUploadedUrl = $state('');
	let isUploading = $state(false);
	let uploadError = $state('');
	let isSubmitting = $state(false);

	let categoryList = $state(data.categories ?? []);
	let value = $state('# Min nya sida');
	let slug = $state('min-nya-sida');
	let title = $state('Min nya sida');
	let category = $state(1);
	let dialogOpen = $state(false);

	let isUserAdmin = $state(false);

	onMount(() => {
		// This fetch happens only in the browser.
		fetch('/api/?checkadmin')
			.then((res) => res.json())
			.then((authData) => {
				if (authData.isAdmin) {
					isUserAdmin = true;
				}
			});
	});

	const carta = new Carta({
		sanitizer: false,
		gfmOptions: {
			singleTilde: false
		},
		extensions: [
			imsize(),
			attachment({
				async upload(file: File) {
					const formData = new FormData();
					formData.append('image', file);

					try {
						const response = await fetch('?/imageUpload', {
							method: 'POST',
							body: formData
						});

						// STEG 1: Öppna "paketet" och se vad som är inuti
						// Detta parsar JSON-datan från serverns svar.
						const resultData = await response.json();
						const result = JSON.parse(resultData.data);

						console.log(result[3]);

						// STEG 2: Kontrollera om allt gick bra, BÅDE nätverket OCH din action.
						// `!response.ok` fångar HTTP-fel (t.ex. 404, 500).
						// `!resultData.success` fångar fel som din action skickar (t.ex. valideringsfel).
						if (!response.ok || !result[3]) {
							// Använd felmeddelandet från serverns svar för bästa feedback.
							throw new Error(resultData.error || 'Något gick fel vid uppladdningen.');
						}

						// Nu är `resultData` det faktiska objektet: { success: true, url: '...' }
						console.log('Korrekt data från servern:', resultData);

						// STEG 3: Returnera den korrekta URL:en från datan.
						// Detta är URL:en som Carta-pluginet kommer att infoga i din text.
						return result[3];
					} catch (error: any) {
						console.error('Fetch error:', error);
						alert(`Uppladdning misslyckades: ${error.message}`);
						// Kasta felet vidare så att Carta vet att det misslyckades
						throw error;
					}
				}
			}),
			emoji(),
			code(),
			subscript()
		]
	});

	const triggerContent = $derived(
		categoryList.find((f) => f.id === Number(category))?.title ?? 'Välj kategori'
	);
</script>

{isUserAdmin}

{#if isUserAdmin}
	<Label class="mb-2" for="title">Sidans titel</Label>
	<Input
		autocomplete="off"
		autocorrect="off"
		class="mb-4 font-mono text-lime-500"
		name="title"
		bind:value={title}
	/>
	<Label class="mb-2" for="slug"
		><span>
			Sidans slug - <span class="text-muted-foreground">{'tryckfall.nu/' + slug}</span></span
		></Label
	>
	<div class="relative">
		<Input
			autocomplete="off"
			autocorrect="off"
			class=" font-mono mb-4 text-pink-500"
			name="slug"
			bind:value={slug}
		/>
		<Button
			class="cursor-pointer hover:border-primary absolute bg-transparent shadow-none border-muted-foreground -translate-y-1/2 top-1/2 w-[40px] h-[40px] rounded-full right-2"
			onclick={() => (slug = slugify(title))}><Wand class="text-foreground" size={32} /></Button
		>
	</div>
	<Label class="mb-2" for="category">Sidans kategori</Label>
	<Select.Root type="single" name="category" bind:value={category}>
		<Select.Trigger class="w-[180px]">
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Kategorier</Select.Label>
				{#each categoryList as categoryItem}
					<Select.Item value={categoryItem.id.toString()} label={categoryItem.title}>
						{categoryItem.title}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
	<hr class="my-4" />

	<div class="markdown mt-0 mx-0 mb-4 relative">
		<MarkdownEditor {carta} bind:value theme="github" mode="tabs" />
	</div>
{:else}
	<div class="markdown">
		<Markdown {carta} {value} />
	</div>
{/if}
{#if isUserAdmin}
	<form
		method="POST"
		action="?/save"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result, update }) => {
				console.log('SVAR FRÅN SERVERN:', result);
				if (result.type === 'failure') {
					if (result.data?.code === '23505') {
						toast.warning(`Slugen '${slug}' är redan upptagen.`);
					} else {
						toast.error(`Ett fel uppstod: ${result.data?.error || 'Okänt fel'}`);
					}
				}
				if (result.type === 'redirect') {
					goto(result.location);
					return;
				}
				isSubmitting = false;
			};
		}}
	>
		<input type="hidden" name="content" bind:value />
		<input type="hidden" name="slug" bind:value={slug} />
		<input type="hidden" name="title" bind:value={title} />
		<input type="hidden" name="category" bind:value={category} />

		<Button class="cursor-pointer" type="submit" variant="outline" disabled={isSubmitting}>
			{#if isSubmitting}
				Sparar...
			{:else}
				Skapa sida
				<SquarePlus class="ml-2" size={16} />
			{/if}
		</Button>
	</form>
{/if}
