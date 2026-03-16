<script setup lang="ts">
import ActivityCompactCard from '@/features/student/buildProject/views/ProjectActivitiesView/components/cards/ActivityCompactCard/ActivityCompactCard.vue'
import SelectorOverlay from '@/features/student/global/components/interaction/SelectorOverlay/SelectorOverlay.vue'

export interface ActivitiesSelectorProps {
  activities: { id: string, title: string }[]
  readonly?: boolean
}

const { activities } = defineProps<ActivitiesSelectorProps>()

const selectedActivityIds = defineModel<string[]>({ default: [] })

const selectableActivities = computed(() => {
  return activities.map(activity => ({
    value: activity.id,
    label: activity.title,
    baseElement: activity
  }))
})

function getActivityThematic (baseElement?: unknown) {
  if (
    baseElement
    && typeof baseElement === 'object'
    && 'thematic' in baseElement
    && typeof baseElement.thematic === 'string'
  ) {
    return baseElement.thematic
  }

  return 'unknown'
}
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
      <template #default="{ label, value, baseElement }">
        <ActivityCompactCard
          :data-activity-id="value"
          :data-activity-thematic="getActivityThematic(baseElement)"
          :title="label"
        />
      </template>
    </SelectorOverlay>
  </div>
</template>
