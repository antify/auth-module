<script setup lang="ts">
import {validator as _validator, type Input} from '../glue/login.post';
import {type LocationAsRelativeRaw} from 'vue-router';
import {refreshCookie, useRuntimeConfig, useUiClient, useUi, useNuxtApp, useFetch, useRoute} from "#imports";
import {ref, reactive, watch, onBeforeUnmount} from 'vue';

const props = defineProps<{
	provider: string
	tenantId?: string
	forgotPasswordRoute: LocationAsRelativeRaw
}>();
const emit = defineEmits(['login']);
const {tokenCookieName} = useRuntimeConfig().public.authModule;
const route = useRoute();
const uiClient = useUiClient();
const formData = ref<Input>({
	email: 'admin@admin.de',
	password: 'admin',
	// TODO:: rename inviteToken to something cryptic short in query
	inviteToken: route.query?.inviteToken as string,
});
const validator = reactive(_validator);
const loginError = ref<string | null>(null);
const {
	data,
	error,
	execute,
	status,
	pending
} = useFetch('/api/auth-module/login', {
	method: 'post',
	body: formData,
	headers: {
		...useNuxtApp().$databaseModule.getContextHeaders(props.provider, props.tenantId)
	},
	watch: false,
	immediate: false,
	onResponse() {
		// Give all watchers, which have an eye on the cookie, the chance to react
		refreshCookie(tokenCookieName)
	}
});

watch(error, (e) => uiClient.handler.handleResponseError(e));

async function onLogin() {
	loginError.value = null;

	validator.validate(formData.value, 'client');

	if (validator.hasErrors()) {
		return;
	}

	await execute();

	if (data.value?.success) {
		return emit('login');
	}

	if (data.value?.invalidCredentials || data.value?.banned) {
		loginError.value = data.value?.invalidCredentials || data.value?.banned;
	}
}

onBeforeUnmount(() => {
	validator.errorMap = {};
});
</script>

<template>
	<div
		class="login-bg min-h-screen flex justify-center pt-32 px-4 sm:px-6 lg:px-8 "
	>
		<div class="max-w-md w-full space-y-10">
			<slot name="logo">
				<img
					class="mx-auto h-12 w-auto"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
					alt="Workflow"
				/>
			</slot>

			<slot name="loginHeader">
				<h2 class="text-2xl font-medium text-center text-for-white-bg-font">
					Sign in to your account
				</h2>
			</slot>

			<form class="mt-8 space-y-5 bg-neutral-50 p-10 rounded-md shadow-md">
				<AntAlert
					v-if="loginError"
					:expanded="true"
					:color-type="useUi().ColorType.danger"
					:icon="false"
					:dismiss-btn="false"
				>
					{{ loginError }}
				</AntAlert>

				<AntTextInput
					v-model="formData.email"
					label="E-Mail"
					name="email"
					type="email"
					:disabled="status === 'pending'"
					:errors="validator.fieldMap.email.validator.getErrors()"
					@validate="val => validator.fieldMap.email.validator.validate(val, formData.email, 'client')"
				/>

				<!--					TODO:: Replace with AntPasswordInput-->
				<AntTextInput
					v-model="formData.password"
					label="Password"
					name="password"
					type="password"
					:disabled="status === 'pending'"
					:errors="validator.fieldMap.password.validator.getErrors()"
					@validate="val => validator.fieldMap.password.validator.validate(val, formData.password, 'client')"
				/>

				<div class="text-right">
					<NuxtLink
						class="text-sm text-neutral-50-font hover:text-black transition-colors"
						:to="forgotPasswordRoute">Forgot password?
					</NuxtLink>
				</div>

				<AntButton
					:expanded="true"
					:filled="true"
					:color-type="useUi().ColorType.primary"
					:disabled="status === 'pending'"
					@click="() => onLogin()"
				>
					Login
				</AntButton>
			</form>
		</div>
	</div>
</template>

<style scoped>
.login-bg {
	background: radial-gradient(100% 100% at 50% 0%, #F1F5F9 37.5%, #7DD3FC 100%);
}
</style>
