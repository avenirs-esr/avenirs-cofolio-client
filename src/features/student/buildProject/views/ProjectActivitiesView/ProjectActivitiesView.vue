<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import AllActivitiesTab from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesTab/AllActivitiesTab.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.activities') }
])
</script>

<template>
  <PageTitle
    :title="t('student.buildProject.views.projectActivitiesView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.HOME"
  />
  <div class="av-col av-gap-xl">
    <AllActivitiesTab />
  </div>
</template>
