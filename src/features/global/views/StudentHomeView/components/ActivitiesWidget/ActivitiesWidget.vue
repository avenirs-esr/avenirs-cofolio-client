<script setup lang="ts">
import { useGetDeclaredActivitiesView, useGetLatestActivitiesView } from '@/api/avenir-esr'
import HomeWidget from '@/common/components/cards/HomeWidget/HomeWidget.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ICONS, ROUTES } from '@/common/constants'
import { ProjectActivitiesTab } from '@/features/buildProject/types/activities.types'
import ActivityLongIconCard from '@/features/global/views/StudentHomeView/components/ActivityLongIconCard/ActivityLongIconCard.vue'
import { useI18n } from 'vue-i18n'

const { isNew = false } = defineProps<{ isNew?: boolean }>()

const { getErrorMessage } = useApiErrors()

const params = computed(() => ({
  page: 0,
  pageSize: 3,
}))

const {
  data: dataNewActivities,
  error: newActivitiesError,
  isLoading: isLoadingNewActivities,
  isFetching: isFetchingNewActivities
} = useGetLatestActivitiesView(params, { query: { enabled: isNew } })
const newActivities = computed(() => dataNewActivities.value?.data || [])

const {
  data: dataActivities,
  error: activitiesError,
  isLoading: isLoadingActivities,
  isFetching: isFetchingActivities
} = useGetDeclaredActivitiesView(params, { query: { enabled: !isNew } })
const libraryActivities = computed(() => dataActivities.value?.data || [])

const isLoading = computed(() => isNew
  ? isLoadingNewActivities.value || isFetchingNewActivities.value
  : isLoadingActivities.value || isFetchingActivities.value)

const { t } = useI18n()

const activities = computed(() => isNew ? newActivities.value : libraryActivities.value)

const i18nExtension = computed(() => isNew ? 'new' : 'library')

const homeWidgetPops = computed(() => ({
  title: t(`student.global.views.studentHomeView.widgets.ActivitiesWidget.title.${i18nExtension.value}`),
  titleIcon: ICONS.ACTIVITY,
  seeAllLabel: t(`student.global.views.studentHomeView.widgets.ActivitiesWidget.seeAll.${i18nExtension.value}`),
  to: isNew
    ? ROUTES.STUDENT.PROJECT_ACTIVITIES
    : {
        name: ROUTES.STUDENT.PROJECT_ACTIVITIES.name,
        query: { tab: ProjectActivitiesTab[ProjectActivitiesTab.ACTIVITY_LIBRARY] }
      },
}))

const emptyStateMessage = computed(() => t(`student.global.views.studentHomeView.widgets.ActivitiesWidget.emptyState.${i18nExtension.value}`))
const errorStateTitle = computed(() => t(`student.global.views.studentHomeView.widgets.ActivitiesWidget.errorState.${i18nExtension.value}`))
const errorStateDescription = computed(() => getErrorMessage(isNew ? newActivitiesError.value : activitiesError.value))
</script>

<template>
  <HomeWidget
    v-bind="homeWidgetPops"
    type="main"
    :data-testid="`${i18nExtension}-activities-widget`"
  >
    <QuerySuspense
      :is-loading="isLoading"
      :is-empty="activities.length === 0"
      :error="isNew ? newActivitiesError : activitiesError"
      :error-title="errorStateTitle"
      :error-description="errorStateDescription"
      :empty-state-message="emptyStateMessage"
    >
      <div class="av-col av-gap-md">
        <ActivityLongIconCard
          v-for="activity in activities"
          :key="activity.id"
          :activity="activity"
        />
      </div>
    </QuerySuspense>
  </HomeWidget>
</template>
