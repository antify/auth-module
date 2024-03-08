import {useAuth} from '../auth';
import {type JsonWebTokenProvider} from '../../types';
import {type Role, type AuthProviderAccess} from '../datasources/schemas';
import defineDatabaseHandler from '#authModuleDatabaseHandler';
import {type Input, validator} from '../../glue/login.post';
import {type DatabaseHandler} from '../../types';
import {type H3Event} from 'h3';
import {defineEventHandler, readBody} from '#imports';

export default defineEventHandler(async (event: H3Event) => {
	const requestData = await readBody<Input>(event);

	validator.validate(requestData);

	if (validator.hasErrors()) {
		throw new Error(validator.getErrorsAsString());
	}

	const authUtil = useAuth();
	const databaseHandler = (defineDatabaseHandler as DatabaseHandler);
	// TODO:: change email to general identifier
	const auth = await databaseHandler
		.findOneAuthByPassword(requestData.email, await authUtil.hashPassword(requestData.password));

	if (!auth) {
		return {
			invalidCredentials: 'Invalid email or password - please check your credentials and try again.'
		};
	}

	if (auth.isBanned) {
		return {
			banned: 'Your account is banned. Please contact the support.'
		};
	}

	const client = await databaseHandler.getDatabaseClient();
	const RoleModel = client.getModel<Role>('roles');
	const authProviderAccesses = await client
		.getModel<AuthProviderAccess>('auth_provider_accesses')
		.find({
			auth: auth.id
		})
		.populate({
			path: 'role',
			model: RoleModel
		});

	await authUtil.login( event, {
		id: auth.id,
		isSuperAdmin: auth.isSuperAdmin,
		providers: authProviderAccesses.map<JsonWebTokenProvider>(authProviderAccess => ({
			providerId: authProviderAccess.providerId,
			tenantId: authProviderAccess.tenantId,
			isAdmin: authProviderAccess.role.isAdmin,
			permissions: authProviderAccess.role.permissions
		}))
	});

	return {
		success: true
	};
});
