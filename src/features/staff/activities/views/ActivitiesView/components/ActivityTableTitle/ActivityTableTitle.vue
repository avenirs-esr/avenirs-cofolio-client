<script lang="ts" setup>
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { ROUTES } from '@/common/constants'

export interface ActivityTableTitleProps {
  activity: ActivityTableRow
}

const { activity } = defineProps<ActivityTableTitleProps>()

const to = computed(() => ({
  name: ROUTES.STAFF.ACTIVITY_DETAILS.name,
  params: { status: activity.status, id: activity.id }
}))
</script>

<template>
  <div
    class="activity-table-title av-col av-gap-xs"
    data-testid="activity-table-title"
  >
    <RouterLink
      :to
      :title="activity.title"
      class="name av-max-lines b1-bold av-text-text1"
    >
      {{ activity.title }}
    </RouterLink>
    <ActivityThematicBadge :thematic="activity.thematic" />
  </div>
</template>

<style lang="scss" scoped>
.activity-table-title {
  --max-lines: 2;

  > .name:hover {
    color: var(--light-foreground-primary2);
    text-decoration: underline;
  }
}
</style>
