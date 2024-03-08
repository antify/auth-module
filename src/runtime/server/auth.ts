import * as jose from 'jose';
import {type H3Event} from 'h3';
import {decodeJwt, SignJWT} from 'jose';
import {Guard} from '../guard';
import {type JsonWebToken} from '../types';
import {useRuntimeConfig, getCookie, setCookie} from '#imports';
import * as crypto from 'crypto';

// TODO:: support different algorithm's
export const JWT_ALGORITHM = 'HS256';

export const useAuth = () => {
	const {
		jwtExpiration,
		jwtSecret,
		tokenCookieName,
		passwordSalt
	} = useRuntimeConfig().authModule;

	return {
		async hashPassword(password: string) {
			return new Promise((resolve, reject) => {
				crypto.scrypt(password, passwordSalt, 64, (error, derivedKey) => {
					if (error) {
						return reject(error);
					}

					resolve(derivedKey.toString('hex'));
				});
			});
		},
		async login(event: H3Event, token: JsonWebToken) {
			const expirationDate = new Date();

			expirationDate.setMinutes(expirationDate.getMinutes() + jwtExpiration);

			const rawToken =  await this.signToken(token, jwtSecret, expirationDate.getTime() / 1000);

			setCookie(event, tokenCookieName, rawToken);

			return new Guard(decodeJwt(rawToken));
		},
		async signToken(
			token: JsonWebToken,
			secret: string,
			expiration: number | string | Date,
			issuedAt?: number | string | Date
		) {
			return await new SignJWT(token)
				.setExpirationTime(expiration)
				.setProtectedHeader({alg: JWT_ALGORITHM})
				.setIssuedAt(issuedAt)
				.sign(new TextEncoder().encode(secret));
		},
		async logout(event: H3Event) {
			const expirationDate = new Date();

			expirationDate.setMinutes(expirationDate.getMinutes() + jwtExpiration);

			const rawToken =  await signToken(token, jwtSecret, expirationDate.getTime() / 1000);

			setCookie(event, tokenCookieName, rawToken);

			// TODO:: makes no sense?
			return new Guard();
		},
		/**
		 * Verifies the token.
		 * It is also the only one method to reach the Guard instance. This is by design, to ensure that
		 * the token is verified before any other method is called. This prevents security issues.
		 *
		 * Throw one of following jose errors if something is wrong with the token:
		 * https://github.com/panva/jose/tree/main/docs/classes
		 */
		async verify(event: H3Event) {
			const rawToken = event.headers['authorization'] ||
				getCookie(event, tokenCookieName);

			if (!rawToken) {
				throw new jose.errors.JWSInvalid();
			}

			await jose.jwtVerify(rawToken, new TextEncoder().encode(jwtSecret));

			this.rawToken = rawToken;

			return new Guard(decodeJwt(rawToken));
		}
	}
}
