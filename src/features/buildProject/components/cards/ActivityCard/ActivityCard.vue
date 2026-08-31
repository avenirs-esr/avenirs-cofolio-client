<script setup lang="ts">
import type { ActivityOverviewDTO } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { ROUTES } from '@/common/constants'
import ActivityNewBadge from '@/features/buildProject/components/badges/ActivityNewBadge/ActivityNewBadge.vue'
import ActivityPeriodBadge from '@/features/buildProject/components/badges/ActivityPeriodBadge/ActivityPeriodBadge.vue'
import FloatingIconCard from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

defineProps<{ activity: ActivityOverviewDTO, hideNewLabel?: boolean }>()

const iconOptions = {
  name: MDI_ICONS.TARGET_ARROW,
  color: 'var(--icon)',
  right: '0.4rem',
  bottom: 'calc(-1 * 3.3rem)',
  borderColor: 'var(--other-border-skill-card)'
}
</script>

<template>
  <RouterLink
    :to="{ name: ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG.name, params: { id: activity.id, thematic: activity.thematic } }"
    class="activity-card"
    data-testid="activity-card"
  >
    <FloatingIconCard
      :title="activity.title"
      :icon-options="iconOptions"
      color="var(--surface-background)"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      :header-rows="2"
      title-typography-classes="b1-light"
      title-color="var(--text1)"
      height="27.5rem"
    >
      <template #body>
        <div class="av-col av-pr-4xl--md av-pt-xl av-pt-none--md body av-h-full">
          <div class="av-col av-row--md av-align-start av-justify-start--md av-gap-sm">
            <ActivityThematicBadge
              data-testid="activity-card-thematic-badge"
              small
              :thematic="activity.thematic"
            />
            <ActivityNewBadge v-if="activity.isNew && !hideNewLabel" />
            <DeclaredActivityStatusBadge
              v-if="activity.status"
              :status="activity.status"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="av-col caption-light text-clamp av-hidden av-unhidden--md">
          <div class="av-mb-xs">
            <ActivityPeriodBadge
              v-if="activity.startDate && activity.endDate"
              small
            />
          </div>
          <span
            data-testid="activity-card-summary"
            class="av-text-text2"
          >
            {{ activity.summary }}
          </span>
        </div>
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style scoped lang="scss">
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.activity-card {
  width: 100%;

  @include dsav.min-width(md) {
    width: fit-content;
  }
}

.floating-icon-card {
  @include dsav.min-width(md) {
    min-width: 27rem !important;
    max-width: 27rem !important;
  }
}

.text-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
