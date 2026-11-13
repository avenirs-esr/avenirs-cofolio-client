<script setup lang="ts">
import { AvButton, AvLogo } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'

const { t } = useI18n()
const { noAccount } = useAuthStore()

function onLogoutClick () {
  window.location.assign(__AUTH_LOGOUT_URL__)
}
</script>

<template>
  <div
    class="no-account-view av-col av-align-center av-justify-center av-gap-lg"
    data-testid="no-account-view"
  >
    <AvLogo class="logo" />

    <div class="av-col av-align-center av-gap-md content">
      <h1 class="n5 av-text-primary1">
        {{ t('auth.global.views.NoAccountView.title') }}
      </h1>

      <p role="status">
        {{ t('auth.global.views.NoAccountView.description') }}
      </p>

      <p
        v-if="noAccount?.identifier"
        class="av-col av-align-center av-gap-xs"
        data-testid="no-account-identifier"
      >
        <span class="av-text-sm">{{ t('auth.global.views.NoAccountView.identifier') }}</span>
        <strong>{{ noAccount.identifier }}</strong>
      </p>

      <p class="av-text-sm">
        {{ t('auth.global.views.NoAccountView.hint') }}
      </p>

      <AvButton
        data-testid="no-account-logout-btn"
        :label="t('auth.global.views.NoAccountView.logout')"
        no-sentence-case
        variant="OUTLINED"
        size="LG"
        @click="onLogoutClick"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.no-account-view {
  min-height: 80vh;
  text-align: center;

  .logo {
    max-width: 12rem;
  }

  .content {
    max-width: 36rem;
  }
}
</style>
