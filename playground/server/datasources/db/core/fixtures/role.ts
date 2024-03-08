import {defineFixture} from '@antify/database';
import {PermissionId} from "../../../../../../src/runtime/server/permissions";
import {type Role} from "../../../../../../src/runtime/server/datasources/schemas/role";
import {TEST_TENANT_ID} from "../fixture-utils/tenant";

export const ADMIN_ROLE_ID = "63f73526b5db16c4a92d6c33";
export const EMPLOYEE_ROLE_ID = "63f73526b5db16c4a92d6c34";

function generateRoles(count = 100000) {
	const roles = [];

	for (let i = 0; i < count; i++) {
		roles.push({
			name: "Role " + i,
			isAdmin: false,
			providerId: "tenant",
			tenantId: TEST_TENANT_ID
		})
	}

	return roles;
}

export default defineFixture({
	async load(client) {
		await client.getModel<Role>("roles").insertMany([
			{
				_id: ADMIN_ROLE_ID,
				name: "Admin",
				isAdmin: true,
				providerId: "tenant",
				tenantId: TEST_TENANT_ID
			},
			{
				_id: EMPLOYEE_ROLE_ID,
				name: "Employee",
				isAdmin: false,
				permissions: Object.values(PermissionId),
				providerId: "tenant",
				tenantId: TEST_TENANT_ID
			},
			{
				name: "Admin",
				isAdmin: true,
				providerId: "core"
			},
			...generateRoles()
		])
	},

	dependsOn() {
		return []
	}
});
