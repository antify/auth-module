const passwordSalt = '#a!SaveSalt123';

export default defineNuxtConfig({
	ssr: false,
  modules: [
		'../src/module',
		'@antify/ui-module',
		'@antify/database-module',
		// '@antify/dev-module'
  ],
  authModule: {
    databaseHandler: './server/datasources/db/core/database-handler',
    mainProviderId: 'core', // TODO:: <-- remove. With the database handler this should not needed anymore
    jwtSecret: '#a!SuperSecret123',
    jwtExpiration: '8h',
    passwordSalt
  },
});
