<script lang="ts" setup>
import { validator as registerValidator, Input } from '../glue/register.post';
import { LocationAsRelativeRaw, useRoute } from 'vue-router';

const props = defineProps<{
  context: string;
  tenantId?: string;
  loginRoute: LocationAsRelativeRaw;
}>();
const emit = defineEmits(['register']);
const formData = reactive<Input>({
  email: useRoute().query.mail || '',
  password: 'a@a.de',
  code: useRoute().query.code || '',
});
const repeatPassword = ref('a@a.de');
const validator = reactive(registerValidator);
const { data, pending, error, execute } = useFetch(
  '/api/auth-module/register',
  {
    method: 'POST',
    headers: {
			...useNuxtApp().$databaseModule.getContextHeaders(props.context, props.tenantId)
    },
    immediate: false,
    onRequest({ options }) {
      options.body = formData;
    },
  }
);
// TODO:: remove if https://github.com/nuxt/nuxt/issues/18810 is fixed
pending.value = false;

async function submit() {
  validator.validate({ ...formData, repeatPassword: repeatPassword.value }, 1);

  if (validator.hasErrors()) {
    return;
  }

  await execute();

  if (error.value) {
    throw createError({ ...error.value.data, fatal: true });
  }

  if (data.value?.default) {
    emit('register', data.value.default);
  }
}
</script>

<template>
  <AntLoginLayout>
    <template #logo><span></span></template>
    <template #loginHeader>
      <AntHeader class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Register
      </AntHeader>
    </template>

    <div>
      <div v-if="data?.alreadyExists">
        {{ data.alreadyExists }}
      </div>
    </div>

    <AntForm @submit.prevent="submit">
      <div data-cy="email">
        <AntInput
          v-model:value="formData.email"
          label="Mail"
          :is-error="
            validator.errorMap['email'] &&
            validator.errorMap['email'].length > 0
          "
          :validator="(val: string) => validator.validateProperty('email', val, 1)"
          :disabled="pending"
        />
      </div>

      <div data-cy="password">
        <AntPasswordField
          v-model:password="formData.password"
          label="Password"
          :is-error="
            validator.errorMap['password'] &&
            validator.errorMap['password'].length > 0
          "
          :validator="(val: string) => validator.validateProperty('password', val, 1)"
          :show-password="true"
          :disabled="pending"
        />
      </div>

      <div data-cy="repeatPassword">
        <AntPasswordField
          v-model:password="repeatPassword"
          label="Repeat password"
          :is-error="
            validator.errorMap['repeatPassword'] &&
            validator.errorMap['repeatPassword'].length > 0
          "
          :errors="validator.errorMap['repeatPassword']"
          :validator="(val: string) => validator.validateProperty('repeatPassword', val, 1)"
          :show-password="true"
          :disabled="pending"
        />
      </div>

      <template #error="param">
        <div data-cy="login-errors">
          {{ param.error }}
        </div>
      </template>

      <template #footer>
        <div class="flex items-center justify-between grow">
          <NuxtLink :to="loginRoute">Go to login</NuxtLink>

          <AntButton
            type="submit"
            data-cy="submit"
            :primary="true"
          >
            Register
          </AntButton>
        </div>
      </template>
    </AntForm>
  </AntLoginLayout>
</template>
