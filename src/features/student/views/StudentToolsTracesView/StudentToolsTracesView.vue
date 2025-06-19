<script setup lang="ts">
import { TraceStatus, type TraceViewDTO } from '@/api/avenir-esr'
import { PageTitle } from '@/common/components'
import { useStudentTracesConfigurationQuery } from '@/features/student/queries/use-student-configuration.query/use-student-configuration.query'
import { studentHomeRoute } from '@/features/student/routes'
import { useTracePaginationSizePicker } from '@/store'
import { useI18n } from 'vue-i18n'
import StudentToolsTracesViewContainer from './components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import StudentToolsTracesViewNotice from './components/StudentToolsTracesViewNotice/StudentToolsTracesViewNotice.vue'

const { data: tracesConfig } = useStudentTracesConfigurationQuery()
const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.tools.header') },
  { text: t('student.navigation.tabs.tools.items.traces') }
])

function createMockedTraces () {
  const mockedTraces: TraceViewDTO[] = []
  for (let i = 1; i < 17; i++) {
    const dayNumber = i < 10 ? `0${i}` : i
    const rand = Math.floor(Math.random() * 31) + 1
    const randomDayNumber = rand < 10 ? `0${rand}` : rand
    const trace = {
      id: `trace${i}`,
      title: `Ma super trace numéro ${i}`,
      status: TraceStatus.UNASSOCIATED,
      createdAt: `2025-06-${dayNumber}T10:42:00.000Z`,
      updatedAt: `2025-06-${dayNumber}T11:42:00.000Z`,
      deletionDate: `2025-07-${randomDayNumber}T10:42:00.000Z`
    }
    mockedTraces.push(trace)
  }
  return mockedTraces
}

const mockedTraces = computed(() => createMockedTraces())
const { pageSizeSelected } = storeToRefs(useTracePaginationSizePicker())
const renderedMockedTraces = computed(() => mockedTraces.value.slice().slice(0, pageSizeSelected.value))
</script>

<template>
  <PageTitle
    :title="t('student.views.studentToolsTracesView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <StudentToolsTracesViewNotice
    :traces="mockedTraces"
    :traces-config="tracesConfig"
  />
  <StudentToolsTracesViewContainer :traces="renderedMockedTraces" />
</template>
