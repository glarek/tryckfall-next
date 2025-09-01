import { EditorView } from '@codemirror/view';

// '&' refererar till toppnivå-elementet, .cm-editor.
// Detta liknar hur man skriver i SASS/SCSS.
export const myTheme = EditorView.theme(
	{
		'&': {
			borderRadius: '8px'
		},
		'&.cm-focused': {
			backgroundColor: 'var(--background)', // Bakgrundsfärg för hela editorn
			outline: 'none', // Ta bort den prickiga standard-ramen
			boxShadow: '0 0 0 2px #528bff' // Ersätt med en snyggare "glow"-effekt
		},
		'.cm-content': {
			caretColor: '#528bff', // Färg på textmarkören
			fontFamily: '"JetBrains Mono Variable", mono',
			fontSize: '14px'
		},
		'&.cm-focused .cm-cursor': {
			borderLeftColor: '#528bff'
		},
		'&.cm-focused .cm-selectionBackground, ::selection': {
			backgroundColor: '#3e4451' // Bakgrund för markerad text
		},
		'.cm-gutters': {
			backgroundColor: '#21252b',
			color: '#676f7d', // Färg på radnummer
			borderRight: '1px solid #282c34'
		},
		'.cm-activeLine': {
			backgroundColor: 'rgba(255, 255, 255, 0.05)'
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'rgba(255, 255, 255, 0.1)'
		}
	},
	{ dark: true }
); // Ange att det är ett mörkt tema
