<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useBreadcrumb } from '@/common/composables'
import StudentToolsTracesViewContainer from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { breadcrumbLinks } = useBreadcrumb()
</script>

<template>
  <PageTitle
    :title="t('student.traces.views.StudentToolsTracesView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />

  <StudentToolsTracesViewContainer />
</template>
