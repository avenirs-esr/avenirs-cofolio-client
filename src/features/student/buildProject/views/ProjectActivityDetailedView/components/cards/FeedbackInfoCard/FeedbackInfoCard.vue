<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import {
  isActivityFeedbackRequestsDisabled,
  isActivityFeedbackRequestsLimited,
  isActivityFeedbackRequestsUnlimited
} from '@/common/activities/rules/activity-feedbacks.rules'
import WarningBadge from '@/common/components/badges/WarningBadge/WarningBadge.vue'
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'
import { AvBadge, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackInfoCardProps {
  activity: DeclaredActivityDetailsDTO
  showAdditionalInfo?: boolean
}

const { activity, showAdditionalInfo = true } = defineProps<FeedbackInfoCardProps>()
const { t } = useI18n()

const translationKey = 'student.buildProject.activities.views.ProjectActivityDetailedView.FeedbackInfoCard'

const iterationsLabel = computed(() => {
  switch (true) {
    case isActivityFeedbackRequestsUnlimited(activity.activity):
      return t(`${translationKey}.iterationsUnlimited`)
    case isActivityFeedbackRequestsDisabled(activity.activity):
      return t(`${translationKey}.disabled`)
    default:
      return t(`${translationKey}.iterations`, {
        count: activity.activity.feedbackAllowedIterations,
      })
  }
})

const feedbackRequestLimited = computed(() => isActivityFeedbackRequestsLimited(activity.activity))
</script>

<template>
  <Card
    background-color="var(--card)"
    title-background="var(--card)"
    data-testid="feedback-info-card"
  >
    <template #title>
      <AvIconText
        typography-class="n6"
        :icon="ICONS.FEEDBACK"
        icon-color="var(--dark-background-primary1)"
        :text="t('student.buildProject.activities.views.ProjectActivityDetailedView.FeedbackInfoCard.title')"
        text-color="var(--text1)"
        gap="var(--spacing-sm)"
        data-testid="feedback-info-card-title"
      />
    </template>

    <template
      v-if="showAdditionalInfo"
      #body
    >
      <AvIconText
        :icon="MDI_ICONS.INFORMATION_OUTLINE"
        icon-color="var(--text2)"
        :text="t('student.buildProject.activities.views.ProjectActivityDetailedView.FeedbackInfoCard.description')"
        text-color="var(--text2)"
        typography-class="b2-light"
        data-testid="feedback-info-card-description"
        :wrap-anywhere="true"
      />
    </template>
    <template #footer>
      <WarningBadge
        v-if="feedbackRequestLimited"
        data-testid="feedback-info-card-iterations-badge"
        :label="iterationsLabel"
        :icon="ICONS.FEEDBACK"
      />
      <AvBadge
        v-else
        data-testid="feedback-info-card-iterations-badge"
        :label="iterationsLabel"
        :icon="ICONS.FEEDBACK"
        color="var(--text1)"
        background-color="var(--light-background-neutral)"
        border-color="transparent"
      />
    </template>
  </Card>
</template>
