import {defineSchema} from '@antify/database';

// export interface Auth {
//   password: string | null;
//   isSuperAdmin: boolean;
//   isBanned: boolean;
//   invites: {
//     invitedAt: number;
//     code: string;
//     context: string;
//     tenantId: string | null;
//   }[];
//   forgotPassword: {
//     sendAt: Date;
//     code: string;
//   } | null;
// }

export type Auth = {
  password: string | null;
  isSuperAdmin: boolean;
  isBanned: boolean;
  invites: {
    invitedAt: number;
    code: string;
    context: string;
    tenantId: string | null;
  }[];
  forgotPassword: {
    sendAt: Date;
    code: string;
  } | null;
}

export default defineSchema(async (client) => {
	client.getSchema('auths').add({
		password: {
			type: String,
			required: false
		},
		isSuperAdmin: {
			type: Boolean,
			required: true,
			default: false
		},
		isBanned: {
			type: Boolean,
			required: true,
			default: false
		},
		invites: [
			{
				invitedAt: {
					type: Number,
					required: true
				},
				code: {
					type: String,
					required: true
				},
				// TODO:: change to provider
				context: {
					type: String,
					required: true
				},
				tenantId: {
					type: String
				}
			}
		],
		forgotPassword: {
			type: {
				sendAt: {
					type: Date,
					required: true
				},
				code: {
					type: String,
					required: true
				}
			},
			default: null
		}
	});
});
