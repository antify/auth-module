import {fileURLToPath} from 'url'
import {
	defineNuxtModule,
	createResolver,
	addComponentsDir,
	addServerHandler,
	addPlugin,
	addTemplate,
	addLayout,
	addImports
} from '@nuxt/kit'
import {mailTemplates} from './runtime/server/mailTemplates'

export type ModuleOptions = {
	/**
	 * The main database provider's id where users and there accesses get stored
	 */
	mainProviderId: string;

	/**
	 * Salt to hash the password stored in database
	 */
	passwordSalt: string;

	/**
	 * Secret to hash the json web token
	 */
	jwtSecret: string;

	/**
	 * Expiration time in seconds for the json web token
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
		const resolveRuntimeModule = (path: string) => resolve('./runtime', path)

		// TODO:: validate options
		// TODO:: validate, that the main provider id is in the providers
		// TODO:: validate, provider.id is unique
		nuxt.options.runtimeConfig.authModule = options

		const databaseHandlerPath = resolve(nuxt.options.rootDir, options.databaseHandler)

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

		addPlugin(resolve('./runtime/plugins/auth'))

		nuxt.hook('antMailerModule:registerTemplates', () => mailTemplates)

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
		//
		// addServerHandler({
		// 	route: "/api/auth-module/forgot-password",
		// 	method: "post",
		// 	handler: resolve(runtimeDir, "server/api/forgot-password.post")
		// })
		//
		// addServerHandler({
		// 	route: "/api/auth-module/reset-password",
		// 	method: "post",
		// 	handler: resolve(runtimeDir, "server/api/reset-password.post")
		// })
	}
})
