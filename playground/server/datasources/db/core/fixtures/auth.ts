import {defineFixture} from '@antify/database';
import {hashPassword} from '../../../../../../src/cli/hash-password';
import {type Auth} from '../../../../../../src/runtime/server/datasources/schemas/auth';

export const ADMIN_AUTH_ID = '63f73526b5db16c4a92d6c37';
export const EMPLOYEE_AUTH_ID = '63f73526b5db16c4a92d6c38';
export const PASSWORD_SALT = '#a!SaveSalt123';

export default defineFixture({
	async load(client) {
		await client.getModel<Auth>('auths').insertMany([
			{
				_id: ADMIN_AUTH_ID,
				password: await hashPassword(
					'admin',
					PASSWORD_SALT
				),
				name: 'Admin',
				isSuperAdmin: true
			},
			{
				_id: EMPLOYEE_AUTH_ID,
				password: await hashPassword(
					'user',
					PASSWORD_SALT
				),
				isSuperAdmin: false
			}
		]);
	},

	dependsOn() {
		return [];
	}
});
