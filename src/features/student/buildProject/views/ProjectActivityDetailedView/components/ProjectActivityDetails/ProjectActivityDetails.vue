<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import ActivityDescriptionContent from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.vue'
import ActivityExecutionPeriodList from '@/common/activities/components/ActivityExecutionPeriodList/ActivityExecutionPeriodList.vue'
import ActivityPeriodDisplay from '@/common/activities/components/ActivityPeriodDisplay/ActivityPeriodDisplay.vue'
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ProjectActivityDetailsProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}
const { declaredActivityDetails } = defineProps<ProjectActivityDetailsProps>()
const { t } = useI18n()
const hasPeriodInfo = computed(() => !!declaredActivityDetails.startDate || !!declaredActivityDetails.endDate)
</script>

<template>
  <div
    class="av-col av-gap-md"
    data-testid="project-activity-details"
  >
    <ActivityPeriodDisplay
      v-if="hasPeriodInfo"
      :start-date="declaredActivityDetails.startDate"
      :end-date="declaredActivityDetails.endDate"
    />
    <Card
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
          <ActivityDescriptionContent
            :description="declaredActivityDetails.activity.description"
          />
        </div>
        <div class="av-col av-gap-sm">
          <span class="n4">
            {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.ProjectActivityDetails.executionPeriodTitle') }}
          </span>
          <ActivityExecutionPeriodList
            :execution-period-info=" declaredActivityDetails.activity.executionPeriodInfo"
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.n4 {
  color: var(--dark-background-primary1);
}
</style>
