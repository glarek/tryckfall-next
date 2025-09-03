<script lang="ts">
	import { enhance } from '$app/forms';
	import { updatePost, createPost, deletePost } from '../../wiki.remote';
	import { goto } from '$app/navigation';

	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { toast } from 'svelte-sonner';

	import { PenLine, Trash2, Wand, LoaderCircle } from '@lucide/svelte';

	import slugify from '@sindresorhus/slugify';
	import { is } from 'valibot';

	import CodeMirrorEditor from '$lib/components/codemirror/CodeMirrorEditor.svelte';

	let { data = null } = $props();

	let isSubmitting = $state(false);
	const isNew = data.cleanPages ? false : true;

	let categoryList = $state(data.categories);
	let contentValue = $state(data.cleanPages?.content || '');
	const oldSlug = data.cleanPages?.slug || '';
	let slug = $state(data.cleanPages?.slug || '');
	let title = $state(data.cleanPages?.title || '');
	let category = $state(data.cleanPages?.category.toString() || '');
	let dialogOpen = $state(false);

	import { compile } from 'mdsvex';

	import remarkSubSuper from 'remark-sub-super';

	let compiledHtml = $state('');

	$effect(() => {
		async function updatePreview() {
			try {
				const result = await compile(contentValue, { remarkPlugins: [remarkSubSuper] });
				if (result) {
					// Extrahera Svelte-komponenten och rendera den
					compiledHtml = result.code;
					// En liten justering för att hantera hur Svelte-komponenter i mdsvex kompileras
				} else {
					compiledHtml = '';
				}
			} catch (error) {
				console.error('Fel vid kompilering av MDSvex:', error);
			}
		}

		updatePreview();
	});

	function updateSlugify() {
		slug = slugify(title);
	}

	let edited = $derived.by(() => {
		contentValue;
		slug;
		title;
		category;
		return true;
	});

	edited = false;

	const triggerContent = $derived(
		categoryList.find((f) => f.id === Number(category))?.title ?? 'Välj kategori'
	);
</script>

<Tabs.Root value="settings">
	<Tabs.List>
		<Tabs.Trigger value="settings">Inställningar</Tabs.Trigger>
		<Tabs.Trigger value="preview">Förhandsvy</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="settings">
		<Label class="mb-2" for="title">Sidans titel</Label>
		<Input
			autocomplete="off"
			autocorrect="off"
			class="mb-4 font-mono"
			name="title"
			bind:value={title}
			oninput={() => updateSlugify()}
		/>
		<Label class="mb-2" for="slug"
			><span>
				Sidans slug - <span class="text-muted-foreground">{'tryckfall.nu/wiki/' + slug}</span></span
			></Label
		>
		<div class="relative">
			<Input
				onchange={() => (edited = true)}
				autocomplete="off"
				autocorrect="off"
				class=" font-mono mb-4"
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

		<CodeMirrorEditor bind:contentValue />

		<div class="markdown mt-0 mx-0 mb-4 relative">
			{#if edited}
				<div class="transition-all absolute -bottom-3 p-1 right-2 bg-primary rounded-full">
					<PenLine size={20} />
				</div>
			{/if}
		</div>

		{#if isNew}
			<form
				{...createPost.enhance(async ({ data, submit }) => {
					isSubmitting = true;
					const formData = new FormData();
					data.set('content', contentValue);
					data.set('slug', slug);
					data.set('title', title);
					data.set('category', category);

					try {
						await submit();
						goto(`/wiki/${slug}`);
						isSubmitting = false;
					} catch (error) {
						toast.error(error.body?.message);
						console.log(error);
						isSubmitting = false;
					}
				})}
			>
				<Button type="submit" class="cursor-pointer shadow-none" variant="outline">
					<div class="flex flex-row w-[100px] items-center gap-x-2">
						{#if !isSubmitting}
							Skapa sida <PenLine />
						{:else}
							Skapa sida<LoaderCircle class="h-fit w-fit animate-spin" />
						{/if}
					</div></Button
				>
			</form>
		{:else}
			<form
				{...updatePost.enhance(async ({ data, submit }) => {
					isSubmitting = true;
					const formData = new FormData();
					data.set('content', contentValue);
					data.set('slug', slug);
					data.set('title', title);
					data.set('category', category);
					data.set('originalSlug', oldSlug);

					try {
						await submit();
					} catch (error) {
						toast.error('Nånting gick fel!');
						isSubmitting = false;
					}
				})}
			>
				<Button
					type="submit"
					class="cursor-pointer shadow-none"
					disabled={isSubmitting}
					variant="outline"
				>
					<div class="flex flex-row w-[120px] items-center gap-x-2">
						{#if !isSubmitting}
							Spara ändringar <PenLine />
						{:else}
							Spara ändringar<LoaderCircle class="h-fit w-fit animate-spin" />
						{/if}
					</div></Button
				>
			</form>

			<Button
				onclick={() => (dialogOpen = true)}
				class="h-10 cursor-pointer mt-2 border-destructive/[20%]"
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
									{...deletePost.enhance(async ({ data, submit }) => {
										isSubmitting = true;
										data.set('originalSlug', oldSlug);

										try {
											await submit().updates();
										} catch (error) {
											toast.error(error.message);
											isSubmitting = false;
										}
									})}
								>
									<Button type="submit" class="mt-2 w-full cursor-pointer" variant="destructive"
										>{#if !isSubmitting}
											Ta bort sida!
										{:else}
											Tar bort sida!<LoaderCircle class="h-fit w-fit animate-spin" />
										{/if}</Button
									>
								</form>
							</div>
						</Dialog.Description>
					</Dialog.Header>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</Tabs.Content>
	<Tabs.Content value="preview"><div class="markdown">{@html compiledHtml}</div></Tabs.Content>
</Tabs.Root>
