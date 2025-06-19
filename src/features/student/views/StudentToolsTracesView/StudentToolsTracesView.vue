<script setup lang="ts">
import type { TraceViewDTO } from '@/api/avenir-esr'
import { PageTitle } from '@/common/components'
import { useStudentTracesConfigurationQuery } from '@/features/student/queries/use-student-configuration.query/use-student-configuration.query'
import { studentHomeRoute } from '@/features/student/routes'
import { useI18n } from 'vue-i18n'
import StudentToolsTracesViewContainer from './components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import StudentToolsTracesViewNotice from './components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'

const mockedTraces: TraceViewDTO[] = []
const { data: tracesConfig } = useStudentTracesConfigurationQuery()
const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.tools.header') },
  { text: t('student.navigation.tabs.tools.items.traces') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentToolsTracesView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />

  <StudentToolsTracesViewContainer />
  <StudentToolsTracesViewNotice
    :traces="mockedTraces"
    :traces-config="tracesConfig"
  />
</template>
