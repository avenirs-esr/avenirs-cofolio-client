<script lang="ts" setup>
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useI18n } from 'vue-i18n'

export interface ProjectActivitiesCatalogViewProps {
  theme: string
  id: string
}

defineProps<ProjectActivitiesCatalogViewProps>()

const { t } = useI18n()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.activities') }
])
</script>

<template>
  <PageTitle
    :title="t('student.buildProject.views.ProjectActivitiesCatalogView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.HOME"
  />
</template>
