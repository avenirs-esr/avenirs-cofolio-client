<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageTitle from '@/components/PageTitle/PageTitle.vue'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('terms-of-service.views.TermsOfServiceView.title')" />
</template>
