<script setup lang="ts">
import { PageTitle, QuerySuspense } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { useGetLatestCgu } from '@/api/avenir-esr'
import TermsOfServiceUpdateForm from '@/features/terms-of-service/views/TermsOfServiceView/components/forms/TermsOfServiceUpdateForm/TermsOfServiceUpdateForm.vue'

const { t } = useI18n()
const { data: cgu, isLoading, error } = useGetLatestCgu()
</script>

<template>
  <PageTitle :title="t('terms-of-service.views.TermsOfServiceView.title')" />

  <div class="av-col av-gap-sm">
    <QuerySuspense
      :error
      :is-loading
    >
      <TermsOfServiceUpdateForm :cgu />
    </QuerySuspense>
  </div>
</template>
