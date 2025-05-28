<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { studentHomeRoute } from '@/features/student/routes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.tools.items.resumes') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentToolsResumesView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
</template>
