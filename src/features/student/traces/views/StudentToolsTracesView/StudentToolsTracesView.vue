<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import StudentToolsTracesViewContainer from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('student.traces.views.StudentToolsTracesView.title')" />

  <StudentToolsTracesViewContainer />
</template>
