/**
 * Utility to map API response codes to custom Swedish messages.
 * Based on API Documentation v1.0
 */

export const ResponseMessages: Record<string, string> = {
	// Authentication
	MISSING_CREDENTIALS: 'E-post och lösenord krävs.',
	INVALID_CREDENTIALS: 'Felaktig e-post eller lösenord.',
	USER_UNVERIFIED: 'Din e-postadress har inte verifierats än.',
	UNAUTHORIZED_ACCESS: 'Du har inte behörighet att utföra denna åtgärd. Vänligen logga in igen.',

	// Registration
	MISSING_FIELDS: 'Vänligen fyll i alla obligatoriska fält (e-post, lösenord, namn).',
	INVALID_INPUT: 'Ogiltig inmatning. Vänligen kontrollera dina uppgifter.',
	INVALID_EMAIL: 'Ogiltig e-postadress.',
	EMAIL_EXISTS: 'En användare med denna e-postadress finns redan.',
	MAIL_SEND_FAILED: 'Misslyckades med att skicka verifieringsmailet. Vänligen försök igen senare.',

	// Verification
	MISSING_TOKEN: 'Verifieringskod saknas.',
	INVALID_TOKEN: 'Ogiltig eller utgången verifieringskod.',

	// System
	UNKNOWN_ERROR: 'Ett oväntat fel uppstod. Vänligen försök igen.',

	// HTTP Status Fallbacks (if no specific code provided)
	'400': 'Ogiltig förfrågan.',
	'401': 'Åtkomst nekad. Vänligen logga in.',
	'403': 'Du har inte behörighet till detta.',
	'404': 'Resursen kunde inte hittas.',
	'409': 'Det finns redan en resurs med dessa uppgifter.',
	'500': 'Ett serverfel uppstod.'
};

/**
 * Returns a Swedish localized message for a given API response code.
 * @param code - The specific error code string (e.g. 'INVALID_CREDENTIALS') or HTTP status code.
 * @param defaultMessage - Optional fallback message if code is not found.
 * @returns Localized string.
 */
export function getLocalizedMessage(
	code: string | number | undefined | null,
	defaultMessage?: string
): string {
	if (!code) {
		return ResponseMessages.UNKNOWN_ERROR;
	}

	const codeStr = String(code);

	if (codeStr in ResponseMessages) {
		return ResponseMessages[codeStr];
	}

	return defaultMessage || ResponseMessages.UNKNOWN_ERROR;
}

/**
 * Helper to handle full API error objects
 */
export function handleApiError(error: any): string {
	console.log('handleApiError', error);
	// Try specific error code first
	if (error?.code) {
		return getLocalizedMessage(error.code);
	}

	// Fallback to status code
	if (error?.status && typeof error.status === 'number') {
		return getLocalizedMessage(error.status);
	}

	// Use message from API if present and no code match?
	// Usually we prefer our custom messages, but if it's a new error...
	if (error?.message) {
		// Maybe log this?
		// return error.message;
	}

	return ResponseMessages.UNKNOWN_ERROR;
}
