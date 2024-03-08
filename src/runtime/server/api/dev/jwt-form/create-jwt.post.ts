import {type JsonWebToken} from '../../../../types';
import {useAuth} from '../../../auth';
import {setCookie} from '#imports';

export default defineEventHandler(async (event) => {
	// TODO:: only call in dev mode!
	const {tokenCookieName, jwtSecret} = useRuntimeConfig().authModule;
	const data = await readBody<JsonWebToken>(event);

	setCookie(
		event,
		tokenCookieName,
		await useAuth().signToken(data, jwtSecret, data.exp || '2h', data.iat)
	);

	return {};
});
