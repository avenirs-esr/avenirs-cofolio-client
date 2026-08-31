<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import StudentToolsTracesViewContainer from '@/features/traces/views/StudentToolsTracesView/components/StudentToolsTracesViewContainer/StudentToolsTracesViewContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.tools.header') },
  { text: t('student.global.navigation.tabs.tools.items.traces') }
])
</script>

<template>
  <PageTitle
    :title="t('student.traces.views.StudentToolsTracesView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />

  <StudentToolsTracesViewContainer />
</template>
