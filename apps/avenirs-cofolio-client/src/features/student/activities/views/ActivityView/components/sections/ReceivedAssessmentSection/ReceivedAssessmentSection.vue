<script lang="ts" setup>
import type { ReceivedAssessmentDTO } from '@/api/avenir-esr'
import { AvBadge, AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { format } from 'date-fns'
import { useI18n } from 'vue-i18n'
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'

export interface ReceivedAssessmentSectionProps {
  assessment?: ReceivedAssessmentDTO
}

const { assessment } = defineProps<ReceivedAssessmentSectionProps>()

const { t } = useI18n()

const i18nKey = 'student.activities.views.ActivityView.ReceivedAssessmentSection'

function formatDate (date: string) {
  return format(new Date(date), 'dd/MM/yyyy')
}

const isSent = computed(() => !!assessment?.sentAt)

const statusMessage = computed(() =>
  assessment?.requestedAt
    ? t(`${i18nKey}.pending`, { date: formatDate(assessment.requestedAt) })
    : t(`${i18nKey}.notSubmitted`)
)

const receivedAtLabel = computed(() =>
  assessment?.sentAt ? t(`${i18nKey}.receivedAt`, { date: formatDate(assessment.sentAt) }) : ''
)

const assessorLabel = computed(() =>
  assessment?.assessedBy ? `${assessment.assessedBy.firstName} ${assessment.assessedBy.lastName}` : undefined
)

const hasGrade = computed(() => assessment?.grade !== undefined && assessment?.grade !== null)

const gradeLabel = computed(() => t(`${i18nKey}.grade`, { grade: assessment?.grade, maxGrade: assessment?.maxGrade }))
</script>

<template>
  <div
    class="av-col av-gap-md"
    data-testid="received-assessment-section"
  >
    <span
      class="n4 av-text-text1"
      data-testid="received-assessment-section-title"
    >
      {{ t(`${i18nKey}.title`) }}
    </span>

    <Card
      v-if="isSent"
      background-color="var(--surface-background)"
      title-background="var(--surface-background)"
      border-color="transparent"
      data-testid="received-assessment-card"
    >
      <template #title>
        <AvIconText
          typography-class="n6"
          :icon="ICONS.ASSESSMENT"
          icon-color="var(--text1)"
          :text="receivedAtLabel"
          text-color="var(--text1)"
          gap="var(--spacing-sm)"
          data-testid="received-assessment-card-title"
        />
      </template>

      <template #body>
        <div class="av-col av-gap-xs av-align-start">
          <span
            v-if="assessorLabel"
            class="b2-regular av-text-text2"
            data-testid="received-assessment-card-assessor"
          >
            {{ assessorLabel }}
          </span>

          <AvBadge
            v-if="hasGrade"
            :label="gradeLabel"
            :icon="MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER"
            color="var(--dark-foreground)"
            background-color="var(--dark-background-primary1)"
            data-testid="received-assessment-card-grade"
          />

          <span
            v-if="assessment?.comment"
            class="b2-light av-text-text1 received-assessment-comment"
            data-testid="received-assessment-card-comment"
          >
            {{ assessment.comment }}
          </span>
        </div>
      </template>
    </Card>

    <AvCard
      v-else
      background-color="var(--surface-background)"
      border-color="transparent"
      data-testid="received-assessment-section-status"
      class="status-message-card"
    >
      <span class="b2-light av-text-text2">
        {{ statusMessage }}
      </span>
    </AvCard>
  </div>
</template>

<style lang="scss" scoped>
.received-assessment-comment {
  white-space: pre-line;
}

.status-message-card {
  border-radius: var(--radius-lg) !important;
}
</style>
