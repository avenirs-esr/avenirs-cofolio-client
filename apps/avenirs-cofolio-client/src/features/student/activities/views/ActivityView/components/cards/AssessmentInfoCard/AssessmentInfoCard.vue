<script setup lang="ts">
import type { ActivityAssessmentDTO } from '@/api/avenir-esr'
import { AvBadge, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { Card } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { isAssessmentEnabled } from '@/common/activities/rules/activities.rules'

export interface AssessmentInfoCardProps {
  assessment?: ActivityAssessmentDTO
}

const { assessment } = defineProps<AssessmentInfoCardProps>()
const { t } = useI18n()

const translationKey = 'student.activities.views.ActivityView.AssessmentInfoCard'

const hasAssessment = computed(() => isAssessmentEnabled({ assessment }))
const hasGrade = computed(() => typeof assessment?.grade === 'number')
</script>

<template>
  <Card
    background-color="var(--card)"
    title-background="var(--card)"
    data-testid="assessment-info-card"
  >
    <template #title>
      <AvIconText
        typography-class="n6"
        :icon="MDI_ICONS.TEXT_BOX_CHECK_OUTLINE"
        icon-color="var(--dark-background-primary1)"
        :text="t(`${translationKey}.title`)"
        text-color="var(--text1)"
        gap="var(--spacing-sm)"
        data-testid="assessment-info-card-title"
      />
    </template>

    <template #footer>
      <div class="av-row av-gap-xs av-align-center av-wrap">
        <AvBadge
          v-if="!hasAssessment"
          data-testid="assessment-info-card-disabled-badge"
          :label="t(`${translationKey}.disabled`)"
          :icon="MDI_ICONS.TEXT_BOX_CHECK_OUTLINE"
          color="var(--text1)"
          background-color="var(--light-background-neutral)"
          border-color="transparent"
        />
        <AvBadge
          v-if="assessment?.comment"
          data-testid="assessment-info-card-comment-badge"
          :label="t(`${translationKey}.comment`)"
          :icon="MDI_ICONS.POST_IT_NOTES_OUTLINE"
          color="var(--text1)"
          background-color="var(--light-background-neutral)"
          border-color="transparent"
        />
        <AvBadge
          v-if="hasGrade"
          data-testid="assessment-info-card-grade-badge"
          :label="t(`${translationKey}.grade`, { maxGrade: assessment?.grade })"
          :icon="MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER"
          color="var(--text1)"
          background-color="var(--light-background-neutral)"
          border-color="transparent"
        />
        <AvBadge
          v-if="assessment?.validation"
          data-testid="assessment-info-card-validation-badge"
          :label="t(`${translationKey}.validation`)"
          :icon="MDI_ICONS.CHECK_CIRCLE_OUTLINE"
          color="var(--text1)"
          background-color="var(--light-background-neutral)"
          border-color="transparent"
        />
      </div>
    </template>
  </Card>
</template>
