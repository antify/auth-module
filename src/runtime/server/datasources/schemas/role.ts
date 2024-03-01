import {defineSchema} from "@antify/database";

export interface Role {
	isAdmin: boolean;
	name: string;
	permissions: string[];
	providerId: string;
	tenantId: string | null;
}

export default defineSchema(async (client) => {
	client.getSchema('roles').add({
		providerId: {
			type: String,
			required: true
		},
		tenantId: {
			type: String,
			required: false
		},
		name: {
			type: String,
			required: true
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false
		},
		permissions: [
			{
				type: String,
				required: true
			}
		]
	});
});
