<script setup lang="ts">
import { EActivityThematic } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'
import ActivityThematicBadge from '@/features/student/buildProject/components/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'
import { ICONS } from '@/features/student/global/icons'

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
