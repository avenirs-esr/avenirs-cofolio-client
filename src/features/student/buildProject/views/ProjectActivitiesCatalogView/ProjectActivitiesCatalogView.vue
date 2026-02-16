<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useActivityDetailQuery } from '@/features/student/buildProject/queries/use-activities.query'
import ActivityPreview from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'

export interface ProjectActivitiesCatalogViewProps {
  theme: string
  id: string
}

const { id } = defineProps<ProjectActivitiesCatalogViewProps>()

const { t } = useI18n()

const { activityDetail, isLoading, isError } = useActivityDetailQuery(id)

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
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <ActivityPreview
      v-if="activityDetail"
      :activity="activityDetail"
    />
  </Loader>
</template>
