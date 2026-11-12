<script lang="ts" setup>
import type { SubActivityOverviewDTO } from '@/api/avenir-esr'
import { QuerySuspense } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'

export interface SubActivitiesListProps {
  subActivities: SubActivityOverviewDTO[]
}

const { subActivities } = defineProps<SubActivitiesListProps>()

const { t } = useI18n()
</script>

<template>
  <QuerySuspense
    :empty-state-message="t('staff.activities.views.EditNationalActivityView.SubActivitiesSortableList.emptyState')"
    :is-empty="subActivities.length === 0"
  >
    <RouterLink
      v-for="subActivity in subActivities"
      :key="subActivity.id"
      class="b2-regular"
      :to="{ name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name, params: { id: subActivity.id } }"
    >
      {{ subActivity.title }}
    </RouterLink>
  </QuerySuspense>
</template>
