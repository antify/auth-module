<script lang="ts" setup>
// TODO:: check client side if token is fine
import {PermissionId} from '~/server/permissions';
import {useUi, useGuard, useFetch} from '#imports';
import {ref, watch} from 'vue';

const PROVIDER = 'core'
const {ColorType} = useUi();
const guard = ref(useGuard());
const statusCode = ref<null | number>(null)
const {execute, data} = useFetch('/api/protected-area', {
	immediate: false,
	headers: useNuxtApp().$databaseModule.getContextHeaders(PROVIDER),
	onResponse({response}) {
		statusCode.value = response.status
	}
})

watch(guard, () => {
	console.log('guard changed', guard.value)
})
</script>

<template>
	<div class="flex flex-col	gap-5 p-2.5">
		<div class="text-3xl">Protected area</div>
		<div>
			With this page, you can test if the guard work client- and server side correctly. <br>
			Everything is associated to <strong>{{PROVIDER}}</strong> provider.
		</div>

		<div class="flex gap-2.5 w-full">
			<AntFormGroup class="w-1/2">
				<AntFormGroupLabel>Test guard client side</AntFormGroupLabel>

				<AntField label="Is logged in?">
					<AntTag :color-type="guard.isLoggedIn() ? ColorType.success : ColorType.danger">
						{{ guard.isLoggedIn() }}
					</AntTag>
				</AntField>

				<AntField :label="`Has permission to do ${PermissionId.CAN_READ_SECRET_DATA} on ${PROVIDER} provider`">
					<AntTag
						:color-type="guard.hasPermissionTo(PermissionId.CAN_READ_SECRET_DATA, PROVIDER) ? ColorType.success : ColorType.danger">
						{{ guard.hasPermissionTo(PermissionId.CAN_READ_SECRET_DATA, PROVIDER) }}
					</AntTag>
				</AntField>

				<AntField
					v-if="guard.token"
					label="Token"
				>
					<pre class="rounded-md bg-neutral-100 p-2.5 overflow-auto"
					>{{ guard.token }}</pre>
				</AntField>
			</AntFormGroup>

			<AntFormGroup class="w-1/2">
				<AntFormGroup>
					<AntFormGroupLabel>Test guard server side</AntFormGroupLabel>

					<AntField label="Do a protected request">
						<AntActionButton @click="() => execute()">Submit request</AntActionButton>
					</AntField>

					<AntField
						v-if="statusCode"
						label="Status code">
						<AntTag
							:color-type="statusCode === 200 ? ColorType.success : ColorType.danger">
							{{ statusCode }}
						</AntTag>
					</AntField>

					<AntField
						label="Response"
						v-if="data"
					>
						<pre class="rounded-md bg-neutral-100 p-2.5 overflow-auto">{{ data }}</pre>
					</AntField>
				</AntFormGroup>
			</AntFormGroup>
		</div>

		<AntButton to="/">Go Back</AntButton>
	</div>
</template>
