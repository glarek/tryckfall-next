import {
	EditorView,
	lineNumbers,
	highlightActiveLineGutter,
	highlightSpecialChars,
	drawSelection,
	dropCursor,
	rectangularSelection,
	highlightActiveLine,
	keymap
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { oneDark } from '@codemirror/theme-one-dark';
import { myTheme } from './my-theme';
import { indentUnit } from '@codemirror/language';

/**
 * En Svelte Action för att integrera CodeMirror 6.
 * @param {HTMLElement} node - Elementet som actionen appliceras på.
 * @param {{ value: string, onChange: (value: string) => void }} options - Initialt värde och en callback för ändringar.
 */
export function codemirror(node, options) {
	const extensions = [
		highlightSpecialChars(),
		drawSelection(),
		dropCursor(),
		highlightActiveLine(),
		keymap.of([indentWithTab]),
		oneDark,
		myTheme, // Temat
		EditorView.lineWrapping, // Radbrytning
		indentUnit.of('  '), // Två mellanslag för indentering
		markdown({
			base: markdownLanguage,
			codeLanguages: languages // Tillåt syntax-markering för kodblock (t.ex. ```js)
		}),
		// Lyssnare som anropar vår onChange-callback när innehållet ändras
		EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				options.onChange(update.state.doc.toString());
			}
		})
	];

	let state = EditorState.create({
		doc: options.value,
		extensions
	});

	let view = new EditorView({
		state,
		parent: node
	});

	return {
		// Körs när parametrarna till actionen ändras
		update(newOptions) {
			// Om värdet ändras utifrån (inte från editorn själv), uppdatera editorn.
			if (view.state.doc.toString() !== newOptions.value) {
				view.dispatch({
					changes: { from: 0, to: view.state.doc.length, insert: newOptions.value }
				});
			}
		},
		// Körs när komponenten förstörs, för att städa upp
		destroy() {
			view.destroy();
		}
	};
}
