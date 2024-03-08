import {parse} from 'cookie-es';

export function getAuthorizationHeader(): string | null {
	const {tokenCookieName} = useRuntimeConfig().public.authModule;

	if (typeof document !== 'undefined' && document?.cookie) {
		return parse(document.cookie)[tokenCookieName] || null;
	}

	return null;
}
