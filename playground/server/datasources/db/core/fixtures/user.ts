import {defineFixture} from '@antify/database';
import {type User} from '../schemas/user';
import {ADMIN_AUTH_ID, EMPLOYEE_AUTH_ID} from './auth';

export const ADMIN_USER_ID = '63f73526b5db16c4a92d6c37';
export const EMPLOYEE_USER_ID = '63f73526b5db16c4a92d6c38';

export default defineFixture({
	async load(client) {
		await client.getModel<User>('users').insertMany([
			{
				_id: ADMIN_USER_ID,
				email: 'admin@admin.de',
				auth: {_id: ADMIN_AUTH_ID}
			},
			{
				_id: EMPLOYEE_USER_ID,
				email: 'user@user.de',
				auth: {_id: EMPLOYEE_AUTH_ID}
			}
		]);
	},

	dependsOn() {
		return ['auth'];
	}
});
