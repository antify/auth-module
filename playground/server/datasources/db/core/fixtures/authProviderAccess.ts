import {defineFixture} from '@antify/database';
import {ADMIN_ROLE_ID, EMPLOYEE_ROLE_ID} from './role';
// TODO:: import from #authModule
import {type AuthProviderAccess} from '../../../../../../src/runtime/server/datasources/schemas/authProviderAccess';
import {TEST_TENANT_ID} from '../fixture-utils/tenant';
import {ADMIN_AUTH_ID, EMPLOYEE_AUTH_ID} from './auth';

export default defineFixture({
	async load(client) {
		await client.getModel<AuthProviderAccess>('auth_provider_accesses').insertMany([
			{
				auth: EMPLOYEE_AUTH_ID,
				role: EMPLOYEE_ROLE_ID,
				providerId: 'tenant',
				tenantId: TEST_TENANT_ID,
				isBanned: false,
				isPending: false
			}, {
				auth: ADMIN_AUTH_ID,
				role: ADMIN_ROLE_ID,
				providerId: 'tenant',
				tenantId: TEST_TENANT_ID,
				isBanned: false,
				isPending: false
			}, {
				auth: ADMIN_AUTH_ID,
				role: ADMIN_ROLE_ID,
				providerId: 'core',
				isBanned: false,
				isPending: false
			}
		]);

		// TODO:: create banned and pending user tenant access
	},

	dependsOn() {
		return ['auth', 'role'];
	}
});
