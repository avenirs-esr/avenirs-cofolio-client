<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import StudentProjectTrajectoriesContainer
  from '@/features/student/global/views/StudentProjectTrajectoriesView/components/StudentProjectTrajectoriesContainer/StudentProjectTrajectoriesContainer.vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.trajectories') }
])
</script>

<template>
  <PageTitle
    :title="t('student.global.views.studentProjectTrajectoriesView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />
  <StudentProjectTrajectoriesContainer />
</template>
