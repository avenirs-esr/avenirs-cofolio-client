<script setup lang="ts">
import type { DeclaredActivityViewDTO } from '@/api/avenir-esr'
import ActivityStatusBadge from '@/features/student/buildProject/components/badges/ActivityStatusBadge/ActivityStatusBadge.vue'
import ActivityThematicBadge from '@/features/student/buildProject/components/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import { FloatingIconCard } from '@/features/student/global'
import { ICONS } from '@/features/student/global/icons'
import { AvBadge, RI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface DeclaredActivityCardProps {
  activity: DeclaredActivityViewDTO
}

const { activity } = defineProps<DeclaredActivityCardProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()

const iconOptions = {
  name: ICONS.ACTIVITY,
  color: 'var(--icon)',
  borderColor: 'var(--other-border-skill-card)'
}

const hasPeriod = computed(() => !!activity.startDate && !!activity.endDate)

const titleClasses = computed(() => isMobile.value
  ? 'caption-regular av-text-text1'
  : 'n5 av-text-text1')
</script>

<template>
  <div class="activity-library-card">
    <FloatingIconCard
      :title="activity.title"
      :icon-options="iconOptions"
      color="var(--surface-background)"
      border-color="var(--other-border-skill-card)"
      border-color-on-hover="var(--dark-background-primary1)"
      :header-rows="2"
      custom-title-height="auto"
      :title-typography-classes="titleClasses"
      height="10.8rem"
    >
      <template #body>
        <div class="av-col av-pr-4xl--md av-pl-none av-pl-md--md">
          <div class="av-col av-row--md av-gap-sm av-justify-start av-justify-between--md av-px-xs">
            <div class="av-row av-row-wrap av-align-center av-gap-sm av-hidden av-unhidden--md">
              <AvBadge
                v-if="hasPeriod"
                :label="t('student.buildProject.views.projectActivitiesView.ActivityLibraryCard.period')"
                :icon="RI_ICONS.TIMER_LINE"
                color="var(--text1)"
                background-color="var(--surface-background)"
                border-color="var(--stroke)"
              />
              <ActivityStatusBadge :status="activity.status" />
            </div>
            <ActivityThematicBadge :thematic="activity.thematic" />
          </div>

          <p class="av-hidden av-unhidden--md av-px-xs">
            <span class="activity-library-card__summary s2-regular av-text-text2">
              {{ activity.summary }}
            </span>
          </p>
        </div>
      </template>
    </FloatingIconCard>
  </div>
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
