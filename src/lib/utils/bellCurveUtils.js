/**
 * Generates a value on a modified bell curve (Gaussian function).
 * The curve is centered around the 'midValue', reaches 'maxValue' at 'midValue',
 * and approaches 'minValue' as 'currentValue' moves further away from 'midValue'.
 *
 * This version is "kinder", meaning it's easier to reach values closer to 'maxValue'
 * when 'currentValue' is near 'midValue', by making the curve narrower.
 *
 * @param {number} minValue - The lowest possible output value.
 * @param {number} maxValue - The highest possible output value (at midValue).
 * @param {number} midValue - The value where the curve is centered and reaches its maximum.
 * @param {number} currentValue - The current value for which the bell curve position should be calculated.
 * @returns {number} The bell curve value at 'currentValue', within the range [minValue, maxValue].
 */
export function getBellCurveValue(minValue, maxValue, midValue, currentValue) {
	if (minValue >= maxValue) {
		console.error(
			"Error: 'minValue' must be less than 'maxValue'. Returning 'midValue' as a fallback."
		);
		return midValue;
	}

	const range = maxValue - minValue;

	// --- Justering för att göra kurvan "snällare" ---
	// Ett mindre sigma-värde gör kurvan smalare och högre,
	// vilket innebär att den är "snällare" mot mitten-värdet.
	// Prova t.ex. range / 8, range / 10 eller ännu mindre för en spetsigare kurva.
	// Det ursprungliga var range / 4.
	const sigma = range / 1.8; // <-- Denna har ändrats från /4 till /8

	// Gaussian function: f(x) = a * e^(-(x - b)^2 / (2 * c^2))
	const exponent = -Math.pow(currentValue - midValue, 2) / (2 * Math.pow(sigma, 2));
	const bellCurveFactor = Math.exp(exponent);

	const result = minValue + range * bellCurveFactor;

	return Math.max(minValue, result);
}
