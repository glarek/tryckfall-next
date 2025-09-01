<script>
	let { contentValue = $bindable(), ...props } = $props();

	import { onMount } from 'svelte';
	import { mode } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Bold,
		Italic,
		Subscript,
		Superscript,
		Strikethrough,
		Underline,
		Highlighter
	} from '@lucide/svelte';

	import CodeMirror from 'svelte-codemirror-editor';
	import { EditorView, basicSetup } from 'codemirror';
	import { keymap } from '@codemirror/view';
	import { EditorSelection } from '@codemirror/state';
	import { markdown } from '@codemirror/lang-markdown';
	import { oneDark } from '@codemirror/theme-one-dark';
	import { ayuLight } from 'thememirror';

	let editorView;

	const boldClick = () => {
		if (!editorView) return;
		toggleBold(editorView);
		editorView.focus();
	};

	const italicClick = () => {
		if (!editorView) return;
		toggleItalic(editorView);
		editorView.focus();
	};

	const markClick = () => {
		if (!editorView) return;
		toggleMark(editorView);
		editorView.focus();
	};

	const toggleMark = (view) => {
		const { state, dispatch } = view;
		const changes = state.changeByRange((range) => {
			const isMarkBefore = state.sliceDoc(range.from - 6, range.from) === '<mark>';
			const isMarkAfter = state.sliceDoc(range.to, range.to + 7) === '</mark>';
			const changes = [];

			changes.push(
				isMarkBefore
					? {
							from: range.from - 6,
							to: range.from,
							insert: ''
						}
					: {
							from: range.from,
							insert: '<mark>'
						}
			);

			changes.push(
				isMarkAfter
					? {
							from: range.to,
							to: range.to + 7,
							insert: ''
						}
					: {
							from: range.to,
							insert: '</mark>'
						}
			);

			const extendBefore = isMarkBefore ? -6 : 6;
			const extendAfter = isMarkAfter ? -6 : 6;

			return {
				changes,
				range: EditorSelection.range(range.from + extendBefore, range.to + extendAfter)
			};
		});

		dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'format' }));
		return true; // Viktigt att returnera true för att signalera att kommandot hanterades
	};

	const toggleBold = (view) => {
		const { state, dispatch } = view;
		const changes = state.changeByRange((range) => {
			const isBoldBefore = state.sliceDoc(range.from - 2, range.from) === '**';
			const isBoldAfter = state.sliceDoc(range.to, range.to + 2) === '**';
			const changes = [];

			changes.push(
				isBoldBefore
					? {
							from: range.from - 2,
							to: range.from,
							insert: ''
						}
					: {
							from: range.from,
							insert: '**'
						}
			);

			changes.push(
				isBoldAfter
					? {
							from: range.to,
							to: range.to + 2,
							insert: ''
						}
					: {
							from: range.to,
							insert: '**'
						}
			);

			const extendBefore = isBoldBefore ? -2 : 2;
			const extendAfter = isBoldAfter ? -2 : 2;

			return {
				changes,
				range: EditorSelection.range(range.from + extendBefore, range.to + extendAfter)
			};
		});

		dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'format' }));
		return true; // Viktigt att returnera true för att signalera att kommandot hanterades
	};

	const toggleItalic = (view) => {
		const { state, dispatch } = view;
		const changes = state.changeByRange((range) => {
			const isItalicBefore = state.sliceDoc(range.from - 1, range.from) === '*';
			const isItalicAfter = state.sliceDoc(range.to, range.to + 1) === '*';
			const changes = [];

			changes.push(
				isItalicBefore
					? {
							from: range.from - 1,
							to: range.from,
							insert: ''
						}
					: {
							from: range.from,
							insert: '*'
						}
			);

			changes.push(
				isItalicAfter
					? {
							from: range.to,
							to: range.to + 1,
							insert: ''
						}
					: {
							from: range.to,
							insert: '*'
						}
			);

			const extendBefore = isItalicBefore ? -1 : 1;
			const extendAfter = isItalicAfter ? -1 : 1;

			return {
				changes,
				range: EditorSelection.range(range.from + extendBefore, range.to + extendAfter)
			};
		});

		dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'format' }));
		return true; // Viktigt att returnera true för att signalera att kommandot hanterades
	};

	const markdownKeymap = [
		{ key: 'Mod-b', run: toggleBold },
		{ key: 'Mod-q', run: toggleMark },
		{ key: 'Mod-q', run: toggleItalic }
	];

	const paddingTheme = EditorView.theme({
		'&': {
			padding: '5px', // Lägg till yttre marginal om du vill
			paddingLeft: '0px',
			paddingRight: '0px',
			paddingBottom: '0px',
			borderRadius: '8px',
			borderTopLeftRadius: '0px',
			borderTopRightRadius: '0px'
		},
		'&.cm-focused': {
			borderColor: 'var(--primary)'
		},
		'.cm-content': {
			padding: '5px 0' // Lägg till inre marginal (padding)
		},
		'.cm-gutters': {
			// Om du vill ha lite utrymme även när radnummer är borta
			paddingLeft: '0px'
		}
	});

	let selectedTheme = $derived(mode.current === 'light' ? ayuLight : oneDark);
</script>

<div class="border-1 overflow-clip rounded-lg bg-input/30">
	<div class="pl-2 pt-2 pb-2 flex flex-row gap-2">
		<Button variant="outline" class=" border-0 border-muted shadow-none" onclick={boldClick}
			><Bold /></Button
		>
		<Button variant="outline" class="border-0 shadow-none" onclick={italicClick}><Italic /></Button>
		<Button variant="outline" class=" border-0 shadow-none" onclick={markClick}
			><Highlighter /></Button
		>
	</div>
	<CodeMirror
		class="max-h-[500px] overflow-y-auto"
		bind:value={contentValue}
		on:ready={(e) => (editorView = e.detail)}
		lang={markdown()}
		theme={selectedTheme}
		extensions={[basicSetup, EditorView.lineWrapping, paddingTheme, keymap.of(markdownKeymap)]}
	/>
</div>
