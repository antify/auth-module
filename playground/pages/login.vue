<template>
  <AntAuthLoginPage
    provider="core"
    :forgot-password-route="{ name: 'forgot-password' }"
    @login="() => $router.push({ name: 'protected-area' })"
  />
</template>
