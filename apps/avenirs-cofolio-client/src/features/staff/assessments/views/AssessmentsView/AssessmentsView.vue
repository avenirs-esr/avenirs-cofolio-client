<script setup lang="ts">
import { PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import AssessmentsList from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.vue'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('staff.assessments.views.AssessmentsView.title')" />

  <AssessmentsList />
</template>
