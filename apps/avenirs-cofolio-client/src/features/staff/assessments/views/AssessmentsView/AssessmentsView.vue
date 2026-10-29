<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import AssessmentsList from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.vue'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('staff.assessments.views.AssessmentsView.title')" />

  <div class="av-col av-gap-sm">
    <AssessmentsList />
  </div>
</template>
