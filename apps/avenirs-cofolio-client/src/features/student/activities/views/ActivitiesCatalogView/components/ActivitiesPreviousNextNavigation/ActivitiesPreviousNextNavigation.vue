<script setup lang="ts">
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EActivityThematic, useGetActivityNavigation } from '@/api/avenir-esr'
import Loader from '@/common/components/feedback/Loader/Loader.vue'
import { ROUTES } from '@/common/constants'
import { isEnumMember } from '@/common/utils'

export interface ActivitiesPreviousNextNavigationProps {
  widget: boolean
}

const { widget } = defineProps<ActivitiesPreviousNextNavigationProps>()

const { t } = useI18n()
const route = useRoute()

const { data: activitiesRef, isLoading, isError } = useGetActivityNavigation()

function getThematicLabel (title: string) {
  return isEnumMember(EActivityThematic, title) ? t(`global.activities.badges.thematics.${title}`) : title
}

const allActivities = computed(() => {
  const activities = activitiesRef.value ?? []

  return activities
    .map(activity => ({
      value: activity.title,
      label: getThematicLabel(activity.title),
      children: (activity.items ?? []).map(item => ({
        value: item.id,
        label: item.title,
      })),
    }))
})

const routeId = computed(() => typeof route.params.id === 'string' ? route.params.id : undefined)
const routeThematic = computed(() => typeof route.params.thematic === 'string' ? route.params.thematic : undefined)

const nextActivity = computed(() => getAdjacentActivity(1))
const previousActivity = computed(() => getAdjacentActivity(-1))

function getAdjacentActivity (direction: 1 | -1): { value: string | number, parentId: string } | null {
  const thematics = allActivities.value
  const thematicIndex = thematics.findIndex(t => t.value === routeThematic.value)

  if (thematicIndex === -1) {
    return null
  }

  const activities = thematics[thematicIndex].children
  const activityIndex = activities.findIndex(a => a.value === routeId.value)

  if (activityIndex === -1) {
    return null
  }

  const wantedIndex = activityIndex + direction
  const adjacentActivity = activities[wantedIndex]

  if (adjacentActivity) {
    return { value: adjacentActivity.value, parentId: String(thematics[thematicIndex].value) }
  }

  const wantedThematicIndex = (thematicIndex + direction + thematics.length) % thematics.length
  const wantedThematic = thematics[wantedThematicIndex]
  const wantedActivities = wantedThematic.children

  const targetActivity = direction === 1 ? wantedActivities[0] : wantedActivities[wantedActivities.length - 1]

  return targetActivity ? { value: targetActivity.value, parentId: String(wantedThematic.value), } : null
}

const baseRouteName = computed(() => widget ? ROUTES.STUDENT.WIDGET_ACTIVITY_CATALOG.name : ROUTES.STUDENT.ACTIVITIES_CATALOG.name)
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
        :to="{
          name: baseRouteName,
          params: { thematic: previousActivity.parentId, id: previousActivity.value },
        }"
        data-testid="previous-activity-button"
      />

      <AvButton
        v-if="nextActivity"
        :label="t('global.buttons.next')"
        :icon="MDI_ICONS.ARROW_RIGHT_THIN"
        variant="DEFAULT"
        :to="{
          name: baseRouteName,
          params: { thematic: nextActivity.parentId, id: nextActivity.value },
        }"
        data-testid="next-activity-button"
      />
    </div>
  </Loader>
</template>
