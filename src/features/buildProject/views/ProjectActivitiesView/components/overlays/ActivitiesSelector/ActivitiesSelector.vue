<script setup lang="ts">
import { EActivityThematic } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { ICONS } from '@/common/constants'
import { isEnumMember } from '@/common/utils'
import CompactCardSelector from '@/features/global/components/cards/CompactCardSelector/CompactCardSelector.vue'

export interface ActivitiesSelectorProps {
  activities: { id: string, title: string, thematic: EActivityThematic }[]
  readonly?: boolean
}

defineOptions({
  inheritAttrs: false
})

const { activities } = defineProps<ActivitiesSelectorProps>()

const selectedActivityIds = defineModel<string[]>({ default: [] })

const selectableActivities = computed(() => {
  return activities.map(activity => ({
    id: activity.id,
    title: activity.title,
    baseElement: activity,
    showSlot: getActivityThematic(activity) !== 'unknown'
  }))
})

function getActivityThematic (baseElement?: unknown) {
  if (
    baseElement
    && typeof baseElement === 'object'
    && 'thematic' in baseElement
    && typeof baseElement.thematic === 'string'
    && isEnumMember(EActivityThematic, baseElement.thematic)
  ) {
    return baseElement.thematic
  }

  return 'unknown'
}
</script>

<template>
  <div class="av-row av-justify-center av-gap-sm av-radius-md av-wrap">
    <CompactCardSelector
      v-model="selectedActivityIds"
      :elements="selectableActivities"
      :icon="ICONS.ACTIVITY"
      color="var(--text1)"
      icon-color="var(--icon)"
      background-color="var(--surface-background)"
      checkbox-color="var(--dark-background-primary1)"
      overlay-color="var(--dark-background-primary1)"
      :overlay-opacity="0.25"
      :readonly="readonly"
    >
      <template #default="{ element }">
        <div
          v-if="getActivityThematic(element) !== 'unknown'"
          class="av-row"
        >
          <ActivityThematicBadge
            :thematic="(getActivityThematic(element) as EActivityThematic)"
            small
          />
        </div>
      </template>
    </CompactCardSelector>
  </div>
</template>
