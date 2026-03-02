<script setup lang="ts">
import type {
  DeclaredActivityDetailsDTO
} from '@/api/avenir-esr'
import { ICONS } from '@/features/student/global/icons'
import { AvCard, AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ProjectActivityDetailsProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}
const { declaredActivityDetails } = defineProps<ProjectActivityDetailsProps>()
const { t } = useI18n()

const executionPeriodList = computed(() => {
  const raw = declaredActivityDetails.activity.executionPeriodInfo

  if (!raw) {
    return []
  }

  return raw
    .split('\n')
    .map(line => line.trim())
    .map(line => line.replace(/^-+\s*/, ''))
})
</script>

<template>
  <AvCard
    background-color="var(--card2)"
    border-color="transparent"
    data-testid="project-activity-details"
  >
    <div
      class="av-row--md av-justify-between--md av-gap-xl"
      data-testid="project-activity-details"
    >
      <div class="av-col av-gap-sm">
        <AvIconText
          :icon="ICONS.ACTIVITY"
          icon-color="var(--icon)"
          :text="declaredActivityDetails.activity.title"
          text-color="var(--dark-background-primary1)"
          typography-class="n4"
          gap="var(--spacing-md)"
          inline
        />
        <span
          class="s2-regular"
          data-testid="activity-summary"
        >
          {{ declaredActivityDetails.activity.summary }}
        </span>
      </div>
      <div class="av-col av-gap-sm">
        <span class="n4">{{ t('student.buildProject.activities.views.ProjectActivityDetailedView.ProjectActivityDetails.executionPeriodTitle') }}</span>
        <ul
          class="s2-regular execution-list"
          data-testid="activity-execution-period"
        >
          <li
            v-for="(item, index) in executionPeriodList"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </AvCard>
</template>

<style scoped lang="scss">
.n4 {
  color: var(--dark-background-primary1);
}

.execution-list {
  color: var(--dark-background-primary1);
}
</style>
