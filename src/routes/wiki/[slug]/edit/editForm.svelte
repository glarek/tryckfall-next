<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { toast } from 'svelte-sonner';

	import { PenLine, Trash2, Wand } from '@lucide/svelte';

	import { Carta, MarkdownEditor } from 'carta-md';
	import { attachment } from '@cartamd/plugin-attachment';
	import '@cartamd/plugin-attachment/default.css';
	import { imsize } from 'carta-plugin-imsize';
	import { emoji } from '@cartamd/plugin-emoji';
	import { code } from '@cartamd/plugin-code';
	import { subscript } from 'carta-plugin-subscript';
	import 'carta-md/default.css'; /* Default theme */

	import '$lib/styles/github.scss';

	import slugify from '@sindresorhus/slugify';

	let { data } = $props();

	let isSubmitting = $state(false);

	let categoryList = $state(data.categories);
	let value = $state(data.cleanPages.content || '');
	let slug = $state(data.cleanPages.slug || '');
	let title = $state(data.cleanPages.title || '');
	let category = $state(data.cleanPages.category.toString() || '');
	let dialogOpen = $state(false);

	let edited = $derived.by(() => {
		value;
		slug;
		title;
		category;
		return true;
	});

	edited = false;

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
		onchange={() => (edited = true)}
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
	{#if edited}
		<div class="transition-all absolute -bottom-3 p-1 right-2 bg-primary rounded-full">
			<PenLine size={20} />
		</div>
	{/if}
</div>

<form
	method="POST"
	action="?/update"
	use:enhance={() => {
		isSubmitting = true; // Sätt "laddar"-status innan formuläret skickas

		return async ({ result, update, error }) => {
			if (result.type === 'redirect') {
				await goto(result.location, { invalidateAll: true });
				toast.success('Ändringar sparades och sidan laddades om!');
				edited = false;
			} else if (result.type === 'failure') {
				// Hantera fel som returnerats med `fail`
				toast.error(result.data?.error || 'Ett okänt fel inträffade.');
				await update(); // Låt SvelteKit uppdatera `form`-prop
			} else {
				// Fånga andra fall, t.ex. om du glömmer redirect
				await update();
			}
		};
	}}
>
	<input type="hidden" name="content" {value} />
	<input type="hidden" name="slug" bind:value={slug} />
	<input type="hidden" name="title" bind:value={title} />
	<input type="hidden" name="category" bind:value={category} />

	<Button class="cursor-pointer" type="submit" disabled={isSubmitting || !edited} variant="outline">
		{isSubmitting ? 'Sparar...' : 'Spara ändringar'}
		<PenLine class="ml-0" size={16} />
	</Button>
</form>

<Button
	onclick={() => (dialogOpen = true)}
	class="cursor-pointer mt-2 border-destructive/[20%]"
	variant="outline"
>
	Ta bort sida
	<Trash2 class="ml-0" size={16} />
</Button>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger class="modal" disabled={isSubmitting}></Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Är du helt säker?</Dialog.Title>
			<Dialog.Description>
				Denna åtgärd kan inte ångras. Detta kommer permanent att ta bort sidan från databasen!
				<div class="grid grid-cols-[1fr_1fr] gap-2">
					<Button
						onclick={() => (dialogOpen = false)}
						class=" cursor-pointer mt-2 w-full"
						variant="outline">Ångra!</Button
					>
					<form
						method="POST"
						action="?/delete"
						use:enhance={() => {
							isSubmitting = true; // Sätt "laddar"-status innan formuläret skickas
							return async ({ update }) => {
								// Körs när servern har svarat
								await update();
								isSubmitting = false;
							};
						}}
					>
						<Button type="submit" class="mt-2 w-full cursor-pointer" variant="destructive"
							>Ta bort sida!</Button
						>
					</form>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
