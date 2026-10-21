<script lang="ts" setup>
import type { DeclaredActivityViewDTO } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.vue'

export interface ValorizedActivityItemProps {
  activity: DeclaredActivityViewDTO
}

const { activity } = defineProps<ValorizedActivityItemProps>()
</script>

<template>
  <ValorizedItem
    :title="activity.title"
    :item-id="activity.id"
    :type="ValorizedItemType.DECLARED_ACTIVITY"
  >
    <ActivityThematicBadge
      data-testid="thematic-badge"
      :thematic="activity.thematic"
    />
  </ValorizedItem>
</template>
