/**
 * Rounds decimal numbers to the significant amount of numbers. Only performs rounding on values after the decimal.
 *
 * @param {number} value - Number to round.
 * @param {number} significantFigures - Number of significant figures.
 * @returns {number} Returns the rounded input.
 */
export function smartRound(value, significantFigures) {
	if (typeof value !== 'number' || isNaN(value)) {
		return value;
	}

	// Om talet inte har några decimaler, gör ingenting.
	if (value % 1 === 0) {
		return value;
	}

	const integerPart = Math.trunc(value);
	// Räkna antalet siffror i heltalsdelen (hanterar även fallet då talet är < 1).
	const integerDigits = integerPart === 0 ? 0 : String(Math.abs(integerPart)).length;

	// Om antalet siffror i heltalsdelen är LIKA MED ELLER STÖRRE ÄN
	// önskat antal värdesiffror, avrunda till närmaste heltal (i praktiken, ta bort decimalerna).
	if (integerDigits >= significantFigures) {
		// För ditt exempel "59219,21..." med 3 värdesiffror: 5 >= 3 -> returnera 59219.
		// För ditt exempel "162,1" med 3 värdesiffror: 3 >= 3 -> returnera 162.
		return Math.round(value); // Använder Math.round() för korrekt avrundning, t.ex. 162.8 blir 163.
	} else {
		// Annars, avrunda hela talet till angivet antal värdesiffror.
		// .toPrecision() hanterar värdesiffror korrekt för både stora och små tal.
		// För ditt exempel "1,25613" med 3 värdesiffror: 1 < 3 -> avrunda till 1,26.
		// För ditt exempel "0,03216201" med 3 värdesiffror: 0 < 3 -> avrunda till 0,0322.
		return parseFloat(value.toPrecision(significantFigures));
	}
}
