<script setup lang="ts">
import { AvButton } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'

const { t } = useI18n()
const { homeRoute } = useCurrentUser()
</script>

<template>
  <div class="av-col av-align-center av-justify-center av-gap-lg av-h-full">
    <h3>{{ t('global.views.notFoundView.pageNotFound.title') }}</h3>
    <p>{{ t('global.views.notFoundView.pageNotFound.description') }}</p>

    <AvButton
      :label="t('global.views.notFoundView.buttonLabel')"
      :to="homeRoute"
      size="LG"
    />
  </div>
</template>
