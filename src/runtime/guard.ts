import type {JsonWebToken} from './types';

/**
 * Using one guard for client and server side to ensure the same logic is used.
 *
 * // TODO:: does it make sense to have a token which is null?
 */
export class Guard {
	constructor(protected token: JsonWebToken | null) {
	}

	getToken(): JsonWebToken | null {
		return this.token;
	}

	getUserId(): string | null {
		return this.token?.id;
	}

	isLoggedIn(): boolean {
		return this.token !== null;
	}

	isSuperAdmin(): boolean {
		return this.token?.isSuperAdmin || false;
	}

	hasPermissionTo(permission: string[] | string, providerId: string, tenantId: string | null = null) {
		if (this.token?.isSuperAdmin) {
			return true;
		}

		const provider = (this.token?.providers || [])
			.find((provider) => tenantId ?
				tenantId === provider.tenantId && provider.providerId === providerId :
				provider.providerId === providerId);

		if (!provider) {
			return false;
		}

		if (provider.isAdmin) {
			return true;
		}

		if (Array.isArray(permission)) {
			return (provider.permissions || []).some((permissionItem) =>
				permission.some(
					(permissionToFind) => permissionToFind === permissionItem
				)
			);
		}

		return (provider.permissions || []).some(
			(permissionItem) => permissionItem === permission
		);
	}
}
