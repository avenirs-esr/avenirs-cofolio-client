<script lang="ts" setup>
import { type ActivityStaffOverviewDTO, EActivityStatus } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import LongIconCard from '@/common/components/cards/LongIconCard/LongIconCard.vue'
import { ROUTES } from '@/common/constants'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface ActivityLongIconCardProps {
  activity: ActivityStaffOverviewDTO
}

const { activity } = defineProps<ActivityLongIconCardProps>()

const isDraft = computed(() => activity.activityStatus === EActivityStatus.DRAFT)

const longIconCardProps = computed(() => ({
  title: activity.title,
  icon: {
    name: isDraft.value ? MDI_ICONS.TEXT_BOX_EDIT_OUTLINE : MDI_ICONS.TEXT_BOX_CHECK_OUTLINE,
    color: isDraft.value ? 'var(--light-foreground-neutral)' : 'var(--dark-background-success)'
  },
  iconBackgroundColor: isDraft.value ? 'var(--light-background-neutral)' : 'var(--light-background-success)',
  to: { name: ROUTES.STAFF.ACTIVITY_CATALOG.name, params: { status: activity.activityStatus, id: activity.activityId } }
}))
</script>

<template>
  <LongIconCard
    v-bind="longIconCardProps"
    data-testid="activity-long-icon-card"
    :data-activity-id="activity.activityId"
    :data-status="activity.activityStatus"
  >
    <div class="av-row av-gap-sm">
      <ActivityThematicBadge :thematic="activity.thematic" />
    </div>
  </LongIconCard>
</template>
