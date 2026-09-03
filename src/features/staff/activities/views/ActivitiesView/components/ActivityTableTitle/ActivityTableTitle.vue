<script lang="ts" setup>
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { ROUTES } from '@/common/constants'
import { AvTooltip, useTextTruncation } from '@avenirs-esr/avenirs-dsav'

export interface ActivityTableTitleProps {
  activity: ActivityTableRow
}

const { activity } = defineProps<ActivityTableTitleProps>()

const titleRef = ref<HTMLElement | null>(null)
const { isTruncated } = useTextTruncation(titleRef)

const to = computed(() => ({
  name: ROUTES.STAFF.ACTIVITY_CATALOG.name,
  params: { status: activity.status, id: activity.id }
}))
</script>

<template>
  <div
    class="activity-table-title av-col av-gap-xs"
    data-testid="activity-table-title"
    :data-activity-id="activity.id"
    :data-activity-status="activity.status"
  >
    <AvTooltip
      :disabled="!isTruncated"
      :content="activity.title"
    >
      <RouterLink
        :to
        class="name"
        data-testid="activity-table-title-link"
        :data-activity-id="activity.id"
      >
        <span
          ref="titleRef"
          class="av-max-lines b1-bold av-text-text1"
        >
          {{ activity.title }}
        </span>
      </RouterLink>
    </AvTooltip>
    <ActivityThematicBadge :thematic="activity.thematic" />
  </div>
</template>

<style lang="scss" scoped>
.activity-table-title {
  --max-lines: 2;

  .name:hover > * {
    color: var(--light-foreground-primary2);
    text-decoration: underline;
  }
}
</style>
