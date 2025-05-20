<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { studentHomeRoute } from '@/features/student/routes'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.project.items.trajectories') }
])
</script>

<template>
  <PageTitle
    :title="t('student.views.studentProjectTrajectoriesView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
</template>
