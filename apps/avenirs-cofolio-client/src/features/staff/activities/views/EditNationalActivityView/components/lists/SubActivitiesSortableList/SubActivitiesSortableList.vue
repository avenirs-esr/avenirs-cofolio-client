<script lang="ts" setup>
import type { AvInteractiveProps, AvSortableListItem } from '@avenirs-esr/avenirs-dsav'
import type { SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { QuerySuspense, SortableList } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { ROUTES } from '@/common/constants'

export type SubActivitiesSortableListProps = Pick<AvInteractiveProps, 'isLoading'>

const {
  isLoading = false,
} = defineProps<SubActivitiesSortableListProps>()

const subActivities = defineModel<SubActivityOverviewDTO[]>({ required: true })

const { t } = useI18n()

const items = computed<AvSortableListItem[]>({
  get: () => subActivities.value.map(({ id, title }) => ({
    id,
    label: title
  })),
  set: (reorderedItems) => {
    const subActivitiesById = new Map(subActivities.value.map(subActivity => [subActivity.id, subActivity]))

    subActivities.value = reorderedItems
      .map(({ id }) => subActivitiesById.get(id))
      .filter(subActivity => subActivity !== undefined)
  }
})

function formatAnnouncement (element: AvSortableListItem, index: number, targetIndex: number) {
  return t('staff.activities.views.EditNationalActivityView.SubActivitiesSortableList.announcement', {
    subActivityName: element.label,
    fromPos: index + 1,
    toPos: targetIndex + 1,
    subActivitiesLength: subActivities.value.length,
  })
}
</script>

<template>
  <QuerySuspense
    :empty-state-message="t('staff.activities.views.EditNationalActivityView.SubActivitiesSortableList.emptyState')"
    :is-empty="subActivities.length === 0"
  >
    <SortableList
      v-model="items"
      :is-loading
      :announcement-formatter="formatAnnouncement"
    >
      <template #default="{ element }">
        <RouterLink
          class="b2-regular"
          :to="{ name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name, params: { id: element.id } }"
        >
          {{ element.label }}
        </RouterLink>
      </template>
    </SortableList>
  </QuerySuspense>
</template>
