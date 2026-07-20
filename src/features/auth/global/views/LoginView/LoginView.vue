<script setup lang="ts">
import { AvButton, AvLogo } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

function getRedirectUrl (): string {
  const redirectQuery = route.query.redirect

  if (typeof redirectQuery === 'string') {
    const resolved = router.resolve(redirectQuery)
    if (resolved.matched.length > 0) {
      return resolved.href
    }
  }
  return import.meta.env.BASE_URL
}

function onLoginClick () {
  const redirect = encodeURIComponent(getRedirectUrl())
  window.location.replace(`${__AUTH_LOGIN_URL__}?redirect=${redirect}`)
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
