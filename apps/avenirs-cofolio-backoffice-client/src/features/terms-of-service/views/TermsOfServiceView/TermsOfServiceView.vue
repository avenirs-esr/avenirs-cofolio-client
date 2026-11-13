<script setup lang="ts">
import { PageTitle, QuerySuspense } from '@avenirs-esr/shared'
import { useGetLatestCgu } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import TermsOfServiceUpdateForm from '@/features/terms-of-service/views/TermsOfServiceView/components/forms/TermsOfServiceUpdateForm/TermsOfServiceUpdateForm.vue'

const { t } = useI18n()
const { data: cgu, isLoading, error } = useGetLatestCgu()
</script>

<template>
  <PageTitle :title="t('terms-of-service.views.TermsOfServiceView.title')" />

  <QuerySuspense
    :error
    :is-loading="isLoading"
  >
    <TermsOfServiceUpdateForm :cgu />
  </QuerySuspense>
</template>
