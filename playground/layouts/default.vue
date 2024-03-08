<script setup lang='ts'>
import {type JsonWebToken} from '../../src/runtime/types';

const defaultToken: JsonWebToken = {
	id: 'an-user-id',
	isSuperAdmin: false,
	providers: [
		{
			providerId: 'core',
			isAdmin: false,
			permissions: []
		}, {
			providerId: 'tenant',
			tenantId: '63e398316c6c22a1f5479ab6',
			isAdmin: false,
			permissions: []
		}
	]
};
</script>

<template>
	<slot/>

	<AntAuthJWTHelper
		:default-token="defaultToken"
	/>
</template>
