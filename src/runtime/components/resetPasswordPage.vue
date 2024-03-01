<script lang="ts" setup>
import { validator as ResetPasswordValidator } from '../glue/reset-password.post';
import { LocationAsRelativeRaw, useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  context: string;
  tenantId?: string;
  loginRoute: LocationAsRelativeRaw;
}>();
const validator = reactive(ResetPasswordValidator);
const formData = reactive<{
  password: string;
  repeatPassword: string;
}>({
  password: '',
  repeatPassword: '',
});

const { pending, error, execute } = useFetch(
  '/api/auth-module/reset-password',
  {
    method: 'POST',
    headers: {
			...useNuxtApp().$databaseModule.getContextHeaders(props.context, props.tenantId)
    },
    immediate: false,
    onRequest({ options }) {
      options.body = {
        password: formData.password,
        code: useRoute().query.code,
        email: useRoute().query.mail,
      };
    },
  }
);
// TODO:: remove if https://github.com/nuxt/nuxt/issues/18810 is fixed
pending.value = false;

const submit = async () => {
  validator.validate(formData);

  if (validator.hasErrors()) {
    return;
  }

  await execute();

  if (error.value) {
    throw createError({ ...error.value.data, fatal: true });
  }

  // Return to login
  useRouter().push(props.loginRoute);
};
</script>

<template>
  <AntLoginLayout>
    <template #logo><span></span></template>
    <template #loginHeader>
      <AntHeader
        class="mt-6 mb-6 text-center text-3xl font-extrabold text-gray-900"
      >
        Passwort vergessen
      </AntHeader>

      <p class="text-gray-700 px-4">Geben Sie hier Ihr neues Passwort ein</p>
    </template>

    <AntForm @submit.prevent="submit">
      <div data-cy="password">
        <AntPasswordField
          v-model:password="formData.password"
          label="Passwort"
          placeholder="Neues Passwort"
          :is-error="
            validator.errorMap['password'] &&
            validator.errorMap['password'].length > 0
          "
          :errors="validator.errorMap['password']"
          :validator="(val: string) => validator.validateProperty('password', val, 1)"
        >
          <template #errorList="{ errors }">
            <div
              data-cy="error"
              v-for="error in errors"
              class="text-red-500"
            >
              {{ error }}
            </div>
          </template>
        </AntPasswordField>
      </div>

      <div data-cy="repeatPassword">
        <AntPasswordField
          v-model:password="formData.repeatPassword"
          label="Passwort wiederholen"
          placeholder="Neues Passwort wiederholen"
          :is-error="
            validator.errorMap['repeatPassword'] &&
            validator.errorMap['repeatPassword'].length > 0
          "
          :errors="validator.errorMap['repeatPassword']"
          :validator="(val: string) => validator.validateProperty('repeatPassword', val, 1)"
        >
          <template #errorList="{ errors }">
            <div
              data-cy="error"
              v-for="error in errors"
              class="text-red-500"
            >
              {{ error }}
            </div>
          </template>
        </AntPasswordField>
      </div>

      <div class="w-full flex justify-between">
        <AntButton data-cy="cancel">
          <nuxt-link :to="{ name: 'login' }"> Zurück </nuxt-link>
        </AntButton>

        <AntButton
          data-cy="submit"
          type="submit"
          :primary="true"
        >
          Passwort zurücksetzen
        </AntButton>
      </div>
    </AntForm>
  </AntLoginLayout>
</template>
