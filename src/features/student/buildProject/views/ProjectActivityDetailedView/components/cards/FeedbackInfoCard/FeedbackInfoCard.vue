<script setup lang="ts">
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'
import { AvBadge, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackInfoCardProps {
  activity: DeclaredActivityDetailsDTO
}

const { activity } = defineProps<FeedbackInfoCardProps>()
const { t } = useI18n()

const iterationsLabel = computed(() => {
  const key = 'student.buildProject.activities.views.ProjectActivityDetailedView.FeedbackInfoCard'
  if (activity.activity.feedbackAllowedIterations === -1) {
    return t(`${key}.iterationsUnlimited`)
  }
  return t(`${key}.iterations`, { count: activity.activity.feedbackAllowedIterations })
})
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

    <template #body>
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
      <AvBadge
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
