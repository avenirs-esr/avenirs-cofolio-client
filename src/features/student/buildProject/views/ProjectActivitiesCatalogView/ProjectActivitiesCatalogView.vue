<script lang="ts" setup>
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import { useActivityDetailQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import ActivitiesSelectNavigation
  from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSelectNavigation/ActivitiesSelectNavigation.vue'
import ActivitiesSideNavigation
  from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSideNavigation/ActivitiesSideNavigation.vue'
import ActivityPreview from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ProjectActivitiesCatalogViewProps {
  theme: string
  id: string
}

const { id } = defineProps<ProjectActivitiesCatalogViewProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const { activityDetail, isLoading, isError, error } = useActivityDetailQuery(id)

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
  <div
    data-testid="activities-layout"
    class="av-justify-center av-my-md"
    :class="[isMobile ? 'av-column' : 'av-row']"
  >
    <ActivitiesSelectNavigation v-if="isMobile" />
    <ActivitiesSideNavigation v-else />
    <Loader
      :is-loading="isLoading && !isError"
      size="2xl"
    >
      <ActivityPreview
        v-if="activityDetail"
        :activity="activityDetail"
      />
    </Loader>
  </div>
  <ActivityErrorMessage :error="error" />
</template>
