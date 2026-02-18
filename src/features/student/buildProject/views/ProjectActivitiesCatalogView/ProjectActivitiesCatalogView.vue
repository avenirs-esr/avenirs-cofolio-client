<script lang="ts" setup>
import ErrorMessage from '@/common/components/ErrorMessage/ErrorMessage.vue'
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ErrorCodes, ROUTES } from '@/common/constants'
import { useActivityDetailQuery } from '@/features/student/buildProject/queries/use-activities.query'
import ActivityPreview from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { useI18n } from 'vue-i18n'

export interface ProjectActivitiesCatalogViewProps {
  theme: string
  id: string
}

const { id } = defineProps<ProjectActivitiesCatalogViewProps>()

const { t } = useI18n()

const { activityDetail, isLoading, isError, error } = useActivityDetailQuery(id)

const { isNotFound } = useApiErrors(error, ErrorCodes.ACTIVITY_NOT_FOUND)

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

  <ErrorMessage
    v-if="error"
    :title="isNotFound ? t('student.buildProject.views.ProjectActivitiesCatalogView.errors.notFound.title') : t('global.error.generic')"
    :description="isNotFound ? t('student.buildProject.views.ProjectActivitiesCatalogView.errors.notFound.description') : error.message"
  />
</template>
