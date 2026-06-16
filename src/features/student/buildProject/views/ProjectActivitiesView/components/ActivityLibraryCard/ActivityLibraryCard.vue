<script setup lang="ts">
import { type DeclaredActivityViewDTO, EDeclaredActivityStatus } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { ICONS, ROUTES } from '@/common/constants'
import ActivityPeriodBadge from '@/features/student/buildProject/components/badges/ActivityPeriodBadge/ActivityPeriodBadge.vue'
import { FloatingIconCard } from '@/features/student/global'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'

interface DeclaredActivityCardProps {
  activity: DeclaredActivityViewDTO
}

const { activity } = defineProps<DeclaredActivityCardProps>()

const { isMobile } = useAvBreakpoints()

const iconOptions = {
  name: ICONS.ACTIVITY,
  color: 'var(--icon)',
  borderColor: 'var(--other-border-skill-card)'
}

const titleClasses = computed(() => isMobile.value
  ? 'caption-regular av-text-text1'
  : 'n6 av-text-text1')

const isNotSubscribed = computed(() => activity.status !== EDeclaredActivityStatus.SUBSCRIBED)
</script>

<template>
  <RouterLink
    :to="{ name: ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED.name, params: { id: activity.id, thematic: activity.thematic } }"
    class="activity-library-card"
    data-testid="activity-library-card"
    :data-activity-id="activity.activityId"
    :data-activity-thematic="activity.thematic"
  >
    <FloatingIconCard
      :title="activity.title"
      :icon-options="iconOptions"
      color="var(--surface-background)"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      :header-rows="2"
      custom-title-height="auto"
      :title-typography-classes="titleClasses"
      height="12.875rem"
      title-color="var(--text1)"
    >
      <template #body>
        <div class="av-col av-pr-4xl--md av-pl-none av-pl-md--md">
          <div class="av-col av-row--md av-gap-sm av-justify-start av-justify-between--md av-px-xs">
            <div class="av-row av-row-wrap av-align-center av-gap-sm av-hidden av-unhidden--md">
              <ActivityPeriodBadge v-if="activity.startDate && activity.endDate" />
              <DeclaredActivityStatusBadge
                v-if="isNotSubscribed"
                data-testid="activity-library-card-status-badge"
                :status="activity.status"
              />
            </div>
            <ActivityThematicBadge
              data-testid="activity-library-card-thematic-badge"
              :thematic="activity.thematic"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="av-hidden av-unhidden--md av-px-xs w-full">
          <span
            data-testid="activity-library-card-summary"
            class="activity-library-card__summary av-text-text2 caption-light"
          >
            {{ activity.summary }}
          </span>
        </div>
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.activity-library-card {
  &__summary {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
    width: 100%;
  }
}
</style>
