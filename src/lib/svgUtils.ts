// src/lib/svgUtils.ts

import DOMPurify from 'dompurify';

const PRESERVED_VALUES = ['none', 'transparent', 'currentColor'];

/**
 * Bearbetar en rå SVG-sträng för säker inline-rendering. Denna version hanterar
 * både direkta attribut (fill="#000") och inline-stilar (style="fill:#000;").
 *
 * @param svgText Den råa textsträngen för SVG-filen.
 * @returns En rensad och färg-modifierad SVG-sträng.
 */
export function processSvg(svgText: string): string {
	// Kör bara i en webbläsarmiljö
	if (typeof window === 'undefined' || !svgText) {
		return '';
	}

	// Steg 1: Omvandla text till ett SVG-dokument
	const parser = new DOMParser();
	const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

	// Hämta alla element inuti SVG:n
	const allElements = svgDoc.querySelectorAll('*');

	// Steg 2: Loopa igenom varje element och ändra dess färger
	allElements.forEach((el) => {
		// Hantera direkta attribut (fill="..." och stroke="...")
		['fill', 'stroke'].forEach((attr) => {
			const currentValue = el.getAttribute(attr);
			if (
				currentValue &&
				!PRESERVED_VALUES.includes(currentValue) &&
				!currentValue.startsWith('url(')
			) {
				el.setAttribute(attr, 'currentColor');
			}
		});

		// Hantera inline-stilar (style="...")
		if (el instanceof HTMLElement || el instanceof SVGElement) {
			const style = el.style;
			if (style.fill && !PRESERVED_VALUES.includes(style.fill) && !style.fill.startsWith('url(')) {
				style.fill = 'currentColor';
			}
			if (
				style.stroke &&
				!PRESERVED_VALUES.includes(style.stroke) &&
				!style.stroke.startsWith('url(')
			) {
				style.stroke = 'currentColor';
			}
		}
	});

	// Steg 3: Omvandla det modifierade dokumentet tillbaka till text
	const serializer = new XMLSerializer();
	const newSvgText = serializer.serializeToString(svgDoc.documentElement);

	// Steg 4: Sanera ALLTID resultatet som ett sista steg
	return DOMPurify.sanitize(newSvgText, {
		USE_PROFILES: { svg: true, svgFilters: true },
		ADD_TAGS: ['use'],
		ADD_ATTR: ['xlink:href']
	});
}
