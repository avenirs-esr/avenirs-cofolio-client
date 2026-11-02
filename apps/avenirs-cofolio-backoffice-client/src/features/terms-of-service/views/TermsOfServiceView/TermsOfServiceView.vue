<script setup lang="ts">
import { PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('terms-of-service.views.TermsOfServiceView.title')" />
</template>
