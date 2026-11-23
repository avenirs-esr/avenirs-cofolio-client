<script setup lang="ts">
import { AvLogo } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main
    class="forbidden-view av-col av-align-center av-justify-center av-gap-lg av-text-center"
    data-testid="forbidden-view"
  >
    <AvLogo class="logo" />

    <div class="av-col av-align-center av-gap-md content">
      <p
        class="n1 av-text-primary1"
        aria-hidden="true"
      >
        403
      </p>

      <h1 class="n5 av-text-primary1">
        {{ t('global.views.ForbiddenView.title') }}
      </h1>

      <p role="status">
        {{ t('global.views.ForbiddenView.description') }}
      </p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.forbidden-view {
  min-height: 80vh;

  .logo {
    max-width: 12rem;
  }

  .content {
    max-width: 36rem;
  }
}
</style>
