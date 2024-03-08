import {type Role} from "./role"
import {type Auth} from "./auth"
import {defineSchema} from "@antify/database";
import mongoose from 'mongoose';

export const AUTH_PROVIDER_ACCESS_NAME = "auth_provider_accesses"

export interface AuthProviderAccess {
	auth: Auth;
	providerId: string;
	tenantId: string | null;
	role: Role;
	isBanned: Boolean;
	isPending: Boolean;
}

export default defineSchema(async (client) => {
	client.getSchema('auth_provider_accesses').add({
		auth: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'auths',
			required: true
		},
		providerId: {
			type: String,
			required: true
		},
		tenantId: {
			type: String,
			required: false
		},
		role: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'roles',
			required: true
		},
		isBanned: {
			type: Boolean,
			required: true,
			default: false
		},
		isPending: {
			type: Boolean,
			required: true,
			default: true
		}
	});
});
