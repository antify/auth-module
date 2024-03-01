<script lang="ts" setup>
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {validator as forgotPasswordValidator} from '../glue/forgot-password.post';
import {type LocationAsRelativeRaw} from 'vue-router';

const props = defineProps<{
	context: string;
	tenantId?: string;
	backRoute: LocationAsRelativeRaw;
}>();
const validator = reactive(forgotPasswordValidator);
const formData = reactive<{ email: string }>({email: ''});

const {data, status, error, execute} = useFetch(
	'/api/auth-module/forgot-password',
	{
		method: 'POST',
		headers: {
			...useNuxtApp().$databaseModule.getContextHeaders(props.context, props.tenantId)
		},
		immediate: false,
		onRequest({options}) {
			options.body = formData;
		},
	}
);

const submit = async () => {
	validator.validateProperty('email', formData.email, 1);

	if (validator.hasErrors()) {
		return;
	}

	await execute();

	if (error.value) {
		throw createError({...error.value.data, fatal: true});
	}

	if (data.value?.success) {
		formData.email = '';
	}
};
</script>

<template>
	<AntLoginLayout>
		<template #logo><span></span></template>
		<template #loginHeader>
			<AntHeader
				class="mt-6 mb-6 text-center text-3xl font-extrabold text-gray-900"
			>
				Forgot password
			</AntHeader>

			<p class="text-gray-700 px-4">
				Did you forget your password? <br/>No problem. Simply enter your email
				address here. <br/>
				You will then receive an email to reset your password.
			</p>
		</template>

		<div v-if="data?.notFound">
			<p>{{ data.notFound }}</p>
		</div>

		<div v-if="data?.success">
			<p>
				E-Mail wurde erfolgreich versendet. Bitte prüfen Sie Ihr E-Mail
				Postfach.
			</p>
			<p>
				Sollen Sie keine E-Mail erhalten haben, so prüfen Sie bitte auch ihren
				Spam-Ordner.
			</p>
		</div>

		<AntForm @submit.prevent="submit">
			<div data-cy="email">
				<AntInput
					v-model:value="formData.email"
					label="Mail"
					placeholder="Insert mail"
					:leadingIcon="faEnvelope"
					:is-error="
            validator.errorMap['email'] &&
            validator.errorMap['email'].length > 0
          "
					:errors="validator.errorMap['email']"
					:validator="(val: string) => validator.validateProperty('email', val, 1)"
					:disabled="status === 'PENDING'"
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
				</AntInput>
			</div>

			<div class="w-full flex justify-between">
				<AntButton data-cy="cancel">
					<nuxt-link :to="backRoute">Back</nuxt-link>
				</AntButton
				>
				<AntButton
					data-cy="submit"
					type="submit"
					:primary="true"
					:disabled="status === 'PENDING'"
				>
					Submit
				</AntButton>
			</div>
		</AntForm>
	</AntLoginLayout>
</template>
