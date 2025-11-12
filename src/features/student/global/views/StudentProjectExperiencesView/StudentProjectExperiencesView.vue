<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTE_NAMES } from '@/common/constants'
import StudentProjectExperiencesContainer
  from '@/features/student/global/views/StudentProjectExperiencesView/components/StudentProjectExperiencesContainer/StudentProjectExperiencesContainer.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.experiences') }
])
</script>

<template>
  <PageTitle
    :title="t('student.navigation.tabs.project.items.experiences')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.HOME"
  />

  <StudentProjectExperiencesContainer />
</template>
