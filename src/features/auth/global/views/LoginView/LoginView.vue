<script setup lang="ts">
import { AvButton, AvLogo } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

function onLoginClick () {
  const intendedPath = typeof route.query.redirect === 'string'
    ? `/cofolio${route.query.redirect}`
    : `${import.meta.env.BASE_URL}/student/home`
  const redirect = encodeURIComponent(intendedPath)
  window.location.assign(`${__AUTH_LOGIN_URL__}?redirect=${redirect}`)
}
</script>

<template>
  <div
    class="login-view av-row av-align-center"
    data-testid="login-view"
  >
    <div class="av-col av-flex-fill av-align-center av-gap-md">
      <h1 class="n5 av-text-primary1">
        {{ t('auth.global.views.LoginView.title') }}
      </h1>

      <div class="av-col av-gap-md">
        <div class="av-col av-align-center av-gap-xs">
          <label
            class="av-label"
            for="login-btn"
          >
            <span>{{ t('auth.global.views.LoginView.actions.login.label') }}</span>
          </label>

          <AvButton
            id="login-btn"
            data-testid="login-btn"
            class="action-btn av-justify-center"
            :label="t('auth.global.views.LoginView.actions.login.text')"
            no-sentence-case
            variant="OUTLINED"
            @click="onLoginClick"
          />
        </div>

        <div class="av-col av-align-center av-gap-xs">
          <label
            class="av-label"
            for="sign-up-btn"
          >
            <span>{{ t('auth.global.views.LoginView.actions.signUp.label') }}</span>
          </label>

          <AvButton
            id="sign-up-btn"
            data-testid="sign-up-btn"
            class="action-btn av-justify-center"
            :label="t('auth.global.views.LoginView.actions.signUp.text')"
            :disabled="true"
            no-sentence-case
            variant="OUTLINED"
          />
        </div>
      </div>
    </div>

    <div class="av-col av-flex-fill av-p-l">
      <AvLogo class="av-w-full av-h-full" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  min-height: 100vh;

  .action-btn {
    min-width: 12rem;
  }
}
</style>
