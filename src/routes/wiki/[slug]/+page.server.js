import { REVALIDATION_SECRET } from '$env/static/private';

export const config = {
	isr: {
		expiration: false,
		bypassToken: REVALIDATION_SECRET
	}
};
