<script setup lang='ts'>
import { permissions } from '../../src/runtime/server/permissions';
import { type JsonWebToken } from '@antify/ant-guard';

const defaultToken: JsonWebToken = {
  id: 'an-user-id',
  isSuperAdmin: false,
  providers: [
    {
      providerId: 'core',
      isAdmin: false,
      permissions: permissions.map(permission => permission.id)
    }, {
      providerId: 'tenant',
      tenantId: '63e398316c6c22a1f5479ab6',
      isAdmin: false,
      permissions: permissions.map(permission => permission.id)
    }
  ]
};
</script>

<template>
  <AntNavLeftLayout>
    <slot />

    <!--    <AntDevModule-->
    <!--      position="bottom-left"-->
    <!--      :permissions="permissions"-->
    <!--      :default-token="defaultToken"-->
    <!--    />-->
  </AntNavLeftLayout>
</template>
