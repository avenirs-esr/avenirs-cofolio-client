<script setup lang="ts">
import { EActivityStatus, useGetStaffActivityWorkingSpace } from '@/api/avenir-esr'
import HomeWidget from '@/common/components/cards/HomeWidget/HomeWidget.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ICONS, ROUTES } from '@/common/constants'
import ActivityLongIconCard from '@/features/staff/global/views/StaffHomeView/components/ActivityLongIconCard/ActivityLongIconCard.vue'
import { useI18n } from 'vue-i18n'

const { isDraft = false } = defineProps<{ isDraft?: boolean }>()

const { getErrorMessage } = useApiErrors()

const params = computed(() => ({
  page: 0,
  pageSize: 3,
  status: isDraft ? EActivityStatus.DRAFT : EActivityStatus.PUBLISHED
}))

const { data, error, isLoading, isFetching } = useGetStaffActivityWorkingSpace(params)
const activities = computed(() => data.value?.data || [])

const { t } = useI18n()

const i18nExtension = computed(() => isDraft ? 'draft' : 'published')

const homeWidgetPops = computed(() => ({
  title: t(`staff.global.views.StaffHomeView.widgets.ActivitiesWidget.title.${i18nExtension.value}`),
  titleIcon: ICONS.ACTIVITY,
  seeAllLabel: t(`staff.global.views.StaffHomeView.widgets.ActivitiesWidget.seeAll.${i18nExtension.value}`),
  to: ROUTES.STAFF.ACTIVITIES
}))

const emptyStateMessage = computed(() => t(`staff.global.views.StaffHomeView.widgets.ActivitiesWidget.emptyState.${i18nExtension.value}`))
const errorStateTitle = computed(() => t(`staff.global.views.StaffHomeView.widgets.ActivitiesWidget.errorState.${i18nExtension.value}`))
const errorStateDescription = computed(() => getErrorMessage(error.value))
</script>

<template>
  <HomeWidget
    v-bind="homeWidgetPops"
    type="main"
    :data-testid="`${i18nExtension}-activities-widget`"
  >
    <QuerySuspense
      :is-loading="isLoading || isFetching"
      :is-empty="activities.length === 0"
      :error="error"
      :error-title="errorStateTitle"
      :error-description="errorStateDescription"
      :empty-state-message="emptyStateMessage"
    >
      <div class="av-col av-gap-md">
        <ActivityLongIconCard
          v-for="activity in activities"
          :key="activity.activityId"
          :activity="activity"
        />
      </div>
    </QuerySuspense>
  </HomeWidget>
</template>
