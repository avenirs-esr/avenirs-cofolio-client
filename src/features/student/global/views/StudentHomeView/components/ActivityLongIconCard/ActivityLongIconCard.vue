<script lang="ts" setup>
import type { ActivityOverviewDTO, DeclaredActivityViewDTO } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import LongIconCard from '@/common/components/cards/LongIconCard/LongIconCard.vue'
import { ROUTES } from '@/common/constants'
import { IX_ICONS, RI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface ActivityLongIconCardProps {
  activity: ActivityOverviewDTO | DeclaredActivityViewDTO
}

const { activity } = defineProps<ActivityLongIconCardProps>()

const isNew = computed(() => 'isNew' in activity && activity.isNew)

const longIconCardProps = computed(() => ({
  title: activity.title,
  icon: { name: isNew.value ? IX_ICONS.LIBRARY_NEW : RI_ICONS.BOOK_SHELF_LINE, color: isNew.value ? 'var(--dark-background-success)' : 'var(--icon)' },
  iconBackgroundColor: isNew.value ? 'var(--light-background-success)' : 'var(--light-background-neutral)',
  to: isNew.value
    ? { name: ROUTES.STUDENT.ACTIVITIES_CATALOG.name, params: { id: activity.id, thematic: activity.thematic } }
    : { name: ROUTES.STUDENT.ACTIVITY.name, params: { id: activity.id } }
}))
</script>

<template>
  <LongIconCard
    v-bind="longIconCardProps"
    data-testid="activity-long-icon-card"
    :data-activity-id="activity.id"
    :data-new="isNew"
  >
    <div class="av-row av-gap-sm">
      <ActivityThematicBadge :thematic="activity.thematic" />
      <DeclaredActivityStatusBadge
        v-if="activity.status"
        :status="activity.status"
      />
    </div>
  </LongIconCard>
</template>
