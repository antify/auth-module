import {PASSWORD_SALT} from "./server/datasources/db/core/fixtures/auth";
import {PermissionId} from "./server/permissions";

export default defineNuxtConfig({
	ssr: false,
  modules: [
		'../src/module',
		'@antify/ui-module',
		'@antify/database-module'
  ],
  authModule: {
    databaseHandler: './server/datasources/db/core/database-handler',
    mainProviderId: 'core', // TODO:: <-- remove. With the database handler this should not needed anymore
    jwtSecret: '#a!SuperSecret123',
    passwordSalt: PASSWORD_SALT
  },
	devtools: {enabled: true},
	hooks: {
		'authModule:register-permissions': () => {
			return [
				{
					id: PermissionId.CAN_READ_SECRET_DATA,
					name: 'Can read secret data in playground'
				}
			]
		}
	}
});
