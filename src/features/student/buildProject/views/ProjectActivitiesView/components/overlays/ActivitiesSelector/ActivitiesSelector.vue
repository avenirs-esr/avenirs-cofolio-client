<script setup lang="ts">
import type { ActivityItemNavigationDTO } from '@/api/avenir-esr'
import ActivityCompactCard from '@/features/student/buildProject/views/ProjectActivitiesView/components/cards/ActivityCompactCard/ActivityCompactCard.vue'
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'

export interface ActivitiesSelectorProps {
  activities: ActivityItemNavigationDTO[]
  readonly?: boolean
}

const { activities } = defineProps<ActivitiesSelectorProps>()

const selectedActivityIds = defineModel<string[]>({ default: [] })

const selectableActivities = computed(() => {
  return activities.map(activity => ({
    value: activity.id,
    label: activity.title
  }))
})
</script>

<template>
  <div class="av-row av-justify-center av-gap-sm av-radius-md av-wrap">
    <SelectorOverlay
      v-model:selected-elements="selectedActivityIds"
      :selectable-elements="selectableActivities"
      checkbox-color="var(--dark-background-primary1)"
      overlay-color="var(--dark-background-primary1)"
      :overlay-opacity="0.25"
      :readonly="readonly"
    >
      <template #default="{ label }">
        <ActivityCompactCard :title="label" />
      </template>
    </SelectorOverlay>
  </div>
</template>
