<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import { ICONS } from '@/features/student/global/icons'
import { AvCard, AvIconText, AvPeriodInput } from '@avenirs-esr/avenirs-dsav'
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

const hasPeriodInfo = computed(() => !!declaredActivityDetails.startDate || !!declaredActivityDetails.endDate)
</script>

<template>
  <div
    class="av-col av-gap-xxs"
    data-testid="project-activity-details"
  >
    <AvPeriodInput
      v-if="hasPeriodInfo"
      data-testid="activity-period-input"
      label=""
      :start-model-value="declaredActivityDetails.startDate"
      :end-model-value="declaredActivityDetails.endDate"
      :start-label="t('global.beginning')"
      :end-label="t('global.end')"
      start-date-disabled
      end-date-disabled
      show-each-input-label
    />
    <AvCard
      background-color="var(--card2)"
      border-color="transparent"
    >
      <div class="av-row--md av-justify-between--md av-gap-xl">
        <div class="av-col av-gap-sm">
          <AvIconText
            data-testid="activity-title"
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
          <span class="n4">
            {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.ProjectActivityDetails.executionPeriodTitle') }}
          </span>
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
  </div>
</template>

<style scoped lang="scss">
.n4 {
  color: var(--dark-background-primary1);
}

.execution-list {
  color: var(--dark-background-primary1);
}
</style>
