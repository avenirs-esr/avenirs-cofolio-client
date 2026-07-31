<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import ActivityDescriptionContent from '@/common/activities/components/ActivityDescriptionContent/ActivityDescriptionContent.vue'
import ActivityPeriodDisplay from '@/common/activities/components/ActivityPeriodDisplay/ActivityPeriodDisplay.vue'
import ActivityRecommendedCompletionContextsList from '@/common/activities/components/ActivityRecommendedCompletionContextsList/ActivityRecommendedCompletionContextsList.vue'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import Card from '@/common/components/cards/Card/Card.vue'
import IconTitleCardContainer from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.vue'
import ActivityResourcesList from '@/common/components/lists/ActivityResourcesList/ActivityResourcesList.vue'
import { ICONS } from '@/common/constants'
import { AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ProjectActivityDetailsProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}
const { declaredActivityDetails } = defineProps<ProjectActivityDetailsProps>()
const { t } = useI18n()

const activity = computed(() => declaredActivityDetails.activity)
const isActivityPeriodDefined = computed(() => !!activity.value.startDate || !!activity.value.endDate)
const hasPeriodInfo = computed(() => isActivityPeriodDefined.value || !!declaredActivityDetails.startDate || !!declaredActivityDetails.endDate)
const periodStartDate = computed(() => isActivityPeriodDefined.value ? activity.value.startDate : declaredActivityDetails.startDate)
const periodEndDate = computed(() => isActivityPeriodDefined.value ? activity.value.endDate : declaredActivityDetails.endDate)

const resourceCount = computed(() => (activity.value.files?.length ?? 0) + (activity.value.links?.length ?? 0))
</script>

<template>
  <div
    class="av-col av-gap-md"
    data-testid="project-activity-details"
  >
    <ValorizedBadge :valorized="declaredActivityDetails.valorized" />
    <ActivityPeriodDisplay
      v-if="hasPeriodInfo"
      :start-date="periodStartDate"
      :end-date="periodEndDate"
    />
    <Card
      background-color="var(--card2)"
      border-color="transparent"
    >
      <div class="av-row--md av-justify-between--md av-gap-xl">
        <div class="av-col av-gap-sm av-flex-fill">
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
        <div class="av-col av-gap-sm av-flex-fill">
          <span class="n4">
            {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.ProjectActivityDetails.recommendedCompletionContexts') }}
          </span>
          <ActivityRecommendedCompletionContextsList
            :recommended-completion-contexts=" declaredActivityDetails.activity.recommendedCompletionContexts"
          />
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
  </div>
</template>

<style scoped lang="scss">
.n4 {
  color: var(--dark-background-primary1);
}
</style>
