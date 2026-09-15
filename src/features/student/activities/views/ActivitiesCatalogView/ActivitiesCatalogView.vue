<script lang="ts" setup>
import { EActivityStatus, EActivityThematic, useGetActivityNavigation, useGetActivityPresentation } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useNavigation } from '@/common/composables'
import { isEnumMember } from '@/common/utils'
import ActivityErrorMessage from '@/features/student/activities/components/errors/ActivityErrorMessage/ActivityErrorMessage.vue'
import ActivitiesPreviousNextNavigation from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivitiesPreviousNextNavigation/ActivitiesPreviousNextNavigation.vue'
import ActivitiesSelectNavigation
  from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivitiesSelectNavigation/ActivitiesSelectNavigation.vue'
import ActivitiesSideNavigation
  from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivitiesSideNavigation/ActivitiesSideNavigation.vue'
import ActivityPreview from '@/features/student/activities/views/ActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { TanstackStaleTimeConfig } from '@/plugins/tanstack-query/config'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivitiesCatalogViewProps {
  thematic?: string
  id?: string
  widget?: boolean
}

const {
  id = '',
  thematic,
  widget = false
} = defineProps<ActivitiesCatalogViewProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const { navigateToStudentActivitiesCatalog, navigateToStudentWidgetActivityCatalog } = useNavigation()

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

const trailingLinks = computed(() => [{ text: activityDetail.value?.title ?? '' }])

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

  widget
    ? navigateToStudentWidgetActivityCatalog(navParams)
    : navigateToStudentActivitiesCatalog(navParams)
})
</script>

<template>
  <PageTitle
    :title="t('student.activities.views.ActivitiesCatalogView.title')"
    :trailing-links="trailingLinks"
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
      <ActivitiesSelectNavigation :widget />
    </div>
    <ActivitiesSideNavigation
      v-else
      :widget
    />

    <div class="av-col av-gap-sm av-w-full">
      <ActivitiesPreviousNextNavigation :widget />
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
