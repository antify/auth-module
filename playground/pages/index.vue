<script setup lang='ts'>
import { TEST_TENANT_ID } from '~/server/datasources/db/core/fixture-utils/tenant';
</script>

<template>
  <div class="flex space-x-4">
    <div>
      <h1 class="text-2xl">Auth</h1>
      <ul>
        <li>
          <NuxtLink :to="{ name: 'login' }">Login page</NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="{
              name: 'register',
              query: { mail: 'admin@admin.de', code: '0815' },
            }"
          >
            Register page
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="{
              name: 'forgot-password',
            }"
          >
            Forgot password page
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="{
              name: 'reset-password',
              query: {
                code: '0815',
                mail: 'admin@admin.de',
              },
            }"
          >
            Reset password page
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <h1 class="text-2xl">CRUD</h1>
      <ul>
        <li>
          <NuxtLink
            :to="{
              name: 'roles'
            }"
          >
            Roles single tenancy
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            :to="{
              name: 'tenantId-roles',
              params: {tenantId: TEST_TENANT_ID}
            }"
          >
            Roles multi tenancy
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
