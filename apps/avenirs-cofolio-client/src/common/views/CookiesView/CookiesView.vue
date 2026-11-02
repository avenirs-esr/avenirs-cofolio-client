<script setup lang="ts">
import { PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const title = computed(() => t('global.views.cookiesView.title'))

const trailingLinks = computed(() => [{ text: title.value }])
</script>

<template>
  <PageTitle
    :title="title"
    :trailing-links="trailingLinks"
  />
</template>
