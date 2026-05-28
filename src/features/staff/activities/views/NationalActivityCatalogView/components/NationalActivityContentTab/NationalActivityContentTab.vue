<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import ActivityDescriptionContent from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.vue'
import ActivityExecutionPeriodList from '@/common/activities/components/ActivityExecutionPeriodList/ActivityExecutionPeriodList.vue'
import { ICONS } from '@/common/constants'
import NationalActivitySettingDetails from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySettingDetails/NationalActivitySettingDetails.vue'
import { AvCard, AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface NationalActivityContentTabProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<NationalActivityContentTabProps>()

const { t } = useI18n()
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="national-activity-catalog-content-tab"
  >
    <div class="av-col av-gap-xs av-wrap">
      <AvIconText
        :icon="ICONS.ACTIVITY"
        :text="activity.title"
        typography-class="n4"
        text-color="var(--dark-background-primary1)"
        icon-color="var(--icon)"
        data-testid="national-activity-content-tab-title"
      />
      <ActivityThematicBadge
        :thematic="activity.thematic"
        data-testid="national-activity-content-tab-thematic-badge"
      />
    </div>

    <AvCard
      background-color="var(--card2)"
      border-color="transparent"
      data-testid="national-activity-content-tab-schedule-card"
    >
      <div class="av-row--md av-justify-between--md av-gap-xl">
        <div class="av-col av-gap-sm">
          <h4
            class="n4"
            data-testid="national-activity-content-tab-consign-title"
          >
            {{ t('staff.activities.interactions.formFields.ActivityConsignFormField.label') }}
          </h4>
          <ActivityDescriptionContent :description="activity.description" />
        </div>
        <div class="av-col av-gap-sm">
          <h4
            class="n4"
            data-testid="national-activity-content-tab-context-title"
          >
            {{ t('staff.activities.interactions.formFields.ActivityExecutionPeriodFormField.label') }}
          </h4>
          <ActivityExecutionPeriodList :execution-period-info="activity.executionPeriodInfo" />
        </div>
      </div>
    </AvCard>

    <NationalActivitySettingDetails :activity="activity" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.n4) {
  color: var(--dark-background-primary1);
  font-weight: var(--font-weight-regular);
}
</style>
