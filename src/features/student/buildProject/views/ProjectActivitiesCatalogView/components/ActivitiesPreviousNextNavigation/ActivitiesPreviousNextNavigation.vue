<script setup lang="ts">
import { EActivityThematic, useGetActivityNavigation } from '@/api/avenir-esr'
import Loader from '@/common/components/Loader/Loader.vue'
import { ROUTES } from '@/common/constants'
import { isEnumMember } from '@/common/utils'
import { AvButton, type AvSelectOption, type AvSelectSelectedOption, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()

const { data: activitiesRef, isLoading, isError } = useGetActivityNavigation()

function getThematicLabel (title: string) {
  return isEnumMember(EActivityThematic, title) ? t(`global.activities.badges.thematics.${title}`) : title
}

const allActivities = computed<AvSelectOption[]>(() => {
  const activities = activitiesRef.value ?? []

  return activities
    .map(activity => ({
      id: activity.title,
      label: getThematicLabel(activity.title),
      children: (activity.items ?? []).map(item => ({
        id: item.id,
        label: item.title,
      })),
    }))
})

const routeId = computed(() => typeof route.params.id === 'string' ? route.params.id : undefined)

const routeThematic = computed(() => typeof route.params.thematic === 'string' ? route.params.thematic : undefined)

const nextActivity = computed(() => getAdjacentActivity(1))
const previousActivity = computed(() => getAdjacentActivity(-1))

function getAdjacentActivity (direction: 1 | -1): AvSelectSelectedOption | null {
  const thematics = allActivities.value
  const thematicIndex = thematics.findIndex(t => t.id === routeThematic.value)
  if (thematicIndex === -1) {
    return null
  }

  const activities = thematics[thematicIndex].children ?? []
  const activityIndex = activities.findIndex(a => a.id === routeId.value)
  if (activityIndex === -1) {
    return null
  }

  const wantedIndex = activityIndex + direction
  const adjacentActivity = activities[wantedIndex]

  if (adjacentActivity) {
    return { itemId: adjacentActivity.id, parentId: thematics[thematicIndex].id }
  }

  const wantedThematicIndex = (thematicIndex + direction + thematics.length) % thematics.length

  const wantedThematic = thematics[wantedThematicIndex]
  const wantedActivities = wantedThematic.children ?? []

  const targetActivity = direction === 1 ? wantedActivities[0] : wantedActivities[wantedActivities.length - 1]

  return targetActivity ? { itemId: targetActivity.id, parentId: wantedThematic.id } : null
}
</script>

<template>
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <div
      class="av-row av-w-full av-justify-between av-gap-sm"
      data-testid="activities-previous-next-navigation"
    >
      <AvButton
        v-if="previousActivity"
        :label="t('global.buttons.previous')"
        :icon="MDI_ICONS.ARROW_LEFT_THIN"
        variant="DEFAULT"
        small
        :to="{
          name: ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name,
          params: { thematic: previousActivity.parentId, id: previousActivity.itemId },
        }"
        data-testid="previous-activity-button"
      />

      <AvButton
        v-if="nextActivity"
        :label="t('global.buttons.next')"
        :icon="MDI_ICONS.ARROW_RIGHT_THIN"
        variant="DEFAULT"
        small
        :to="{
          name: ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name,
          params: { thematic: nextActivity.parentId, id: nextActivity.itemId },
        }"
        data-testid="next-activity-button"
      />
    </div>
  </Loader>
</template>
