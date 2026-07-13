<script setup lang="ts">
import type { ActivityContentDTO } from '@/api/avenir-esr'
import ActivityThematicBadge from '@/common/activities/badges/ActivityThematicBadge/ActivityThematicBadge.vue'
import ActivityDescriptionContent from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.vue'
import ActivityExecutionPeriodList from '@/common/activities/components/ActivityExecutionPeriodList/ActivityExecutionPeriodList.vue'
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'
import ActivityResourcesList from '@/features/staff/activities/components/lists/ActivityResourcesList/ActivityResourcesList.vue'
import NationalActivitySettingDetails from '@/features/staff/activities/views/NationalActivityCatalogView/components/NationalActivitySettingDetails/NationalActivitySettingDetails.vue'
import IconTitleCardContainer from '@/features/staff/global/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface NationalActivityContentTabProps {
  activity: ActivityContentDTO
}

const { activity } = defineProps<NationalActivityContentTabProps>()

const { t } = useI18n()

const resourceCount = computed(() => (activity.files?.length ?? 0) + (activity.links?.length ?? 0))
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
        typography-class="n4 av-text-regular"
        text-color="var(--dark-background-primary1)"
        icon-color="var(--icon)"
        data-testid="national-activity-content-tab-title"
      />
      <ActivityThematicBadge
        :thematic="activity.thematic"
        data-testid="national-activity-content-tab-thematic-badge"
      />
    </div>

    <Card
      background-color="var(--card2)"
      border-color="transparent"
      data-testid="national-activity-content-tab-schedule-card"
    >
      <div class="av-row--md av-justify-between--md av-gap-xl">
        <div class="av-col av-gap-sm">
          <h4
            data-testid="national-activity-content-tab-consign-title"
            class="av-text-primary1 av-text-regular"
          >
            {{ t('staff.activities.interactions.formFields.ActivityConsignFormField.label') }}
          </h4>
          <ActivityDescriptionContent :description="activity.description" />
        </div>
        <div class="av-col av-gap-sm">
          <h4
            data-testid="national-activity-content-tab-context-title"
            class="av-text-primary1 av-text-regular"
          >
            {{ t('staff.activities.interactions.formFields.ActivityExecutionPeriodFormField.label') }}
          </h4>
          <ActivityExecutionPeriodList :execution-period-info="activity.executionPeriodInfo" />
        </div>
      </div>
    </Card>

    <IconTitleCardContainer
      v-if="resourceCount > 0"
      :title="t('staff.activities.views.NationalActivityCatalogView.NationalActivityContentTab.resourcesTitle', { count: resourceCount })"
      :title-icon="MDI_ICONS.FILE_DOCUMENT_MULTIPLE_OUTLINE"
      data-testid="national-activity-content-tab-resources"
    >
      <ActivityResourcesList
        :activity-id="activity.id"
        :files="activity.files ?? []"
        :links="activity.links ?? []"
      />
    </IconTitleCardContainer>

    <NationalActivitySettingDetails :activity="activity" />
  </div>
</template>
