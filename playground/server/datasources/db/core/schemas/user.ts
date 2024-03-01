import {type Auth} from '../../../../../../src/runtime/server/datasources/schemas/auth';
import {defineSchema} from '@antify/database';
import mongoose from 'mongoose';

export interface User {
	email: string;
	auth: Auth;
}

export default defineSchema(async (client) => {
	client.getSchema('users').add({
		email: {
			type: String,
			required: true,
			unique: true
		},
		auth: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'auths',
			required: false
		}
	});
})
