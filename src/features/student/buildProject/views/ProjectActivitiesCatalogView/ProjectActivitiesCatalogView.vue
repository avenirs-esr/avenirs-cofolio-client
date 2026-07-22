<script lang="ts" setup>
import { EActivityStatus, EActivityThematic, useGetActivityNavigation, useGetActivityPresentation } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { isEnumMember } from '@/common/utils'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import ActivitiesPreviousNextNavigation from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesPreviousNextNavigation/ActivitiesPreviousNextNavigation.vue'
import ActivitiesSelectNavigation
  from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSelectNavigation/ActivitiesSelectNavigation.vue'
import ActivitiesSideNavigation
  from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSideNavigation/ActivitiesSideNavigation.vue'
import ActivityPreview from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { TanstackStaleTimeConfig } from '@/plugins/tanstack-query/config'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export interface ProjectActivitiesCatalogViewProps {
  thematic?: string
  id?: string
}

const { id = '', thematic } = defineProps<ProjectActivitiesCatalogViewProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const { navigateToStudentActivitiesCatalog, navigateToStudentProjectActivitiesCatalog } = useNavigation()
const route = useRoute()

const { data: activityDetail, isLoading, error } = useGetActivityPresentation(EActivityStatus.PUBLISHED, computed(() => id), { query: {
  enabled: computed(() => !!id),
  staleTime: TanstackStaleTimeConfig.DETAILS,
} })
const { data: activities, isLoading: isNavigationLoading, isError: isNavigationError } = useGetActivityNavigation()

const firstCatalogEntry = computed(() => {
  const firstThematic = activities.value?.[0]?.title
  const firstItemId = activities.value?.[0]?.items?.[0]?.id

  if (!firstThematic || !firstItemId || !isEnumMember(EActivityThematic, firstThematic)) {
    return undefined
  }

  return {
    thematic: firstThematic,
    id: firstItemId,
  }
})

const isProjectActivitiesRoute = computed(() => route.name === ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name)

const projectBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.activities'), to: ROUTES.STUDENT.PROJECT_ACTIVITIES },
  { text: activityDetail.value?.title ?? '' }
])

const homeBreadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.items.activities') },
  { text: activityDetail.value?.title ?? '' }
])

const breadcrumbLinks = computed(() => isProjectActivitiesRoute.value
  ? projectBreadcrumbLinks.value
  : homeBreadcrumbLinks.value)

watchEffect(() => {
  const newThematic = thematic
  const newId = id
  const loading = isNavigationLoading.value
  const hasError = isNavigationError.value
  const firstEntry = firstCatalogEntry.value

  if ((newThematic && newId) || loading || hasError || !firstEntry) {
    return
  }

  const navParams = {
    thematic: firstEntry.thematic,
    id: firstEntry.id,
    replace: true,
  }

  isProjectActivitiesRoute.value
    ? navigateToStudentProjectActivitiesCatalog(navParams)
    : navigateToStudentActivitiesCatalog(navParams)
})
</script>

<template>
  <PageTitle
    :title="t('student.buildProject.activities.views.ProjectActivitiesCatalogView.title')"
    :breadcrumb-links="breadcrumbLinks"
  />
  <div
    class="av-py-md av-gap-sm"
    :class="[isMobile ? 'av-col' : 'av-row']"
    data-testid="activities-layout"
  >
    <div
      v-if="isMobile"
      class="av-row av-flex-fill av-justify-center"
    >
      <ActivitiesSelectNavigation :is-project-route="isProjectActivitiesRoute" />
    </div>
    <ActivitiesSideNavigation
      v-else
      :is-project-route="isProjectActivitiesRoute"
    />

    <div class="av-col av-gap-sm av-w-full">
      <ActivitiesPreviousNextNavigation :is-project-route="isProjectActivitiesRoute" />
      <div class="av-row">
        <QuerySuspense
          :error="error"
          :is-loading="isLoading"
        >
          <template #error>
            <ActivityErrorMessage :error="error" />
          </template>
          <ActivityPreview
            v-if="activityDetail"
            :activity="activityDetail"
          />
        </QuerySuspense>
      </div>
    </div>
  </div>
</template>
