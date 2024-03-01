import { TOKEN_COOKIE_KEY } from '@antify/ant-guard';
import { type Input as RegisterInput } from '../glue/register.post';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      auth: {
        async login(identifier: String, password: String, token?: string) {
          return useFetch('/api/auth/login', {
            method: 'POST',
            body: {
              email: identifier,
              password,
              token,
            },
            headers: {
              'Content-Type': 'application/json',
            },
          });
        },
        register(formData: RegisterInput, context: string, tenantId?: string) {
          const { data, pending, refresh, error, execute } = useFetch(
            '/api/auth-module/register',
            {
              method: 'POST',
              body: formData,
              headers: {
								'Content-Type': 'application/json',
								...nuxtApp.$databaseModule.getContextHeaders(context, tenantId)
              },
              immediate: false,
            }
          );

          if (error.value) {
            throw createError({ ...error.value.data, fatal: true });
          }

          return { data, pending, refresh, execute };
        },
        // async refreshToken(): Promise<void> {
        //   await useFetch('/api/auth/refresh_token', {
        //     method: 'POST',
        //     body: {},
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   });
        // },
        // async forgotPassword(identifier: String): Promise<void> {
        //   await useFetch('/api/auth/forgot_password', {
        //     method: 'POST',
        //     body: {
        //       email: identifier,
        //     },
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   });
        // },
        // async newPassword(token: String, password: String): Promise<void> {
        //   await useFetch('/api/auth/new_password', {
        //     method: 'POST',
        //     body: {
        //       token: token,
        //       password: password,
        //     },
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   });
        // },
        // async logout() {
        //   useCookie(TOKEN_COOKIE_KEY).value = null;
        //   await navigateTo({ name: 'login' });
        // },
        // getGuard() {
        //   return useGuard(useCookie(TOKEN_COOKIE_KEY).value || null);
        // },
      },
    },
  };
});
