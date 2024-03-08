import {fileURLToPath} from 'url'
import {
	defineNuxtModule,
	createResolver,
	addComponentsDir,
	addServerHandler,
	addPlugin,
	addTemplate,
	addImportsDir,
	addServerPlugin
} from '@nuxt/kit'
// import {mailTemplates} from './runtime/server/mailTemplates'
import type {Permission} from "./runtime/types";

export type ModuleOptions = {
	/**
	 * Salt to hash the password stored in database
	 */
	passwordSalt: string;

	/**
	 * Secret to hash the json web token
	 */
	jwtSecret: string;

	/**
	 * Expiration time in minutes for the json web token.
	 * Default is 8 hours (480 minutes)
	 */
	jwtExpiration: number;

	/**
	 * Defines if new users can register self to this context.
	 */
	canRegister: boolean;

	/**
	 * Integration between the module and the project's user logic.
	 * Must return a defineDatabaseHandler();
	 */
	databaseHandler: string;

	/**
	 * The name of the cookie to store the jwt token.
	 * Default is antt
	 */
	tokenCookieName: string;

	/**
	 * List of permissions, that are available in the system.
	 * This list can get extended by other modules.
	 */
	permissions: Permission[];
};

// TODO:: on delete tenant, delete user provider accesses and roles
export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: 'auth-module',
		configKey: 'authModule'
	},
	async setup(options, nuxt) {
		// TODO:: Find a way to check this
		// TODO:: Make mailer optional, not required
		// if (!hasNuxtModule('auth-mailer')) {
		//   throw new Error('Missing required module "auth-mailer". Make sure it is configured in nuxt.config modules property.');
		// }
		// TODO:: make sure, the @antify/database-module is installed

		const {resolve} = createResolver(import.meta.url);
		const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

		// TODO:: validate options
		// TODO:: validate, that the main provider id is in the providers
		// TODO:: validate, provider.id is unique
		const tokenCookieName = options.tokenCookieName || 'antt'
		options.tokenCookieName = tokenCookieName;
		options.jwtExpiration = options.jwtExpiration || 480;
		options.permissions = options.permissions || [];
		nuxt.options.runtimeConfig.authModule = options

		// Public runtime config
		nuxt.options.runtimeConfig.public.authModule = {
			tokenCookieName
		}

		const databaseHandlerPath = resolve(nuxt.options.rootDir, options.databaseHandler);

		// Make the database handler available in runtime
		nuxt.hook('nitro:config', (nitroConfig) => {
			nitroConfig.alias = nitroConfig.alias || {}

			nitroConfig.alias['#authModuleDatabaseHandler'] = databaseHandlerPath
		})

		const template = addTemplate({
			filename: 'types/auth-module.d.ts',
			getContents: () => [
				"declare module '#authModuleDatabaseHandler' {",
				`  const default: typeof import("${databaseHandlerPath}").default`,
				'}'
			].join('\n')
		})

		nuxt.hook('prepare:types', (options) => {
			options.references.push({path: template.dst})
		})

		await addComponentsDir({
			path: resolve('./runtime/components'),
			pathPrefix: false,
			prefix: 'AntAuth',
			global: true
		})

		addImportsDir(resolve(runtimeDir, 'composables'));

		// nuxt.hook('mailerModule:registerTemplates', () => mailTemplates)

		// TODO:: May write it into a file in dist dir with types, cuz it does not change after build
		nuxt.hook('modules:done', async () => {
			// TODO:: type hook
			const permissions = await nuxt.callHook('authModule:register-permissions') || [];

			nuxt.options.runtimeConfig.authModule.permissions = permissions;
		});

		// TODO:: only register in dev mode!
		addServerHandler({
			route: '/api/auth-module/dev/jwt-form/create-jwt',
			method: 'post',
			handler: resolve(runtimeDir, 'server/api/dev/jwt-form/create-jwt.post')
		});

		// TODO:: only register in dev mode!
		addServerHandler({
			route: '/api/auth-module/dev/jwt-form/all-permissions',
			method: 'get',
			handler: resolve(runtimeDir, 'server/api/dev/jwt-form/all-permissions.get')
		});

		addServerHandler({
			route: '/api/auth-module/login',
			method: 'post',
			handler: resolve(runtimeDir, 'server/api/login.post')
		})

		// addServerHandler({
		// 	route: "/api/auth-module/register",
		// 	method: "post",
		// 	handler: resolve(runtimeDir, "server/api/register.post")
		// })

		// addServerHandler({
		// 	route: "/api/auth-module/forgot-password",
		// 	method: "post",
		// 	handler: resolve(runtimeDir, "server/api/forgot-password.post")
		// })

		// addServerHandler({
		// 	route: "/api/auth-module/reset-password",
		// 	method: "post",
		// 	handler: resolve(runtimeDir, "server/api/reset-password.post")
		// })
	}
})
