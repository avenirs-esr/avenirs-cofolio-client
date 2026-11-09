<script lang="ts" setup>
import type { AvBadgeProps } from '@avenirs-esr/avenirs-dsav'
import type { AvLocale } from '@avenirs-esr/shared'
import type { ReceivedAssessmentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { AvBadge, AvCard, AvIconText, AvMessage, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { Card, ICONS } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { formatDateLocalized } from '@/common/utils'

export interface ReceivedAssessmentSectionProps {
  assessment?: ReceivedAssessmentDTO
}

const { assessment } = defineProps<ReceivedAssessmentSectionProps>()

const { t, locale } = useI18n()

function formatDate (date: string) {
  return formatDateLocalized(date, locale.value as AvLocale, true)
}

const isSent = computed(() => !!assessment?.sentAt)

const statusMessage = computed(() =>
  assessment?.requestedAt
    ? t('student.activities.views.ActivityView.ReceivedAssessmentSection.pending', { date: formatDate(assessment.requestedAt) })
    : t('student.activities.views.ActivityView.ReceivedAssessmentSection.notSubmitted')
)

const receivedAtLabel = computed(() =>
  assessment?.sentAt
    ? t('student.activities.views.ActivityView.ReceivedAssessmentSection.receivedAt', { date: formatDate(assessment.sentAt) })
    : ''
)

const assessorLabel = computed(() =>
  assessment?.assessedBy ? `${assessment.assessedBy.firstName} ${assessment.assessedBy.lastName}` : undefined
)

const hasGrade = computed(() => assessment?.grade !== undefined && assessment?.grade !== null)

const gradeLabel = computed(() =>
  t('student.activities.views.ActivityView.ReceivedAssessmentSection.grade', { grade: assessment?.grade, maxGrade: assessment?.maxGrade })
)

const hasValidation = computed(() => typeof assessment?.validation === 'boolean')

const validationBadgeProps = computed<AvBadgeProps>(() => assessment?.validation
  ? {
      label: t('student.activities.views.ActivityView.ReceivedAssessmentSection.validated'),
      icon: MDI_ICONS.CHECK_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-success)',
      backgroundColor: 'var(--light-background-success)',
    }
  : {
      label: t('student.activities.views.ActivityView.ReceivedAssessmentSection.notValidated'),
      icon: MDI_ICONS.CLOSE_CIRCLE_OUTLINE,
      color: 'var(--light-foreground-error)',
      backgroundColor: 'var(--light-background-error)',
    }
)
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
      {{ t('student.activities.views.ActivityView.ReceivedAssessmentSection.title') }}
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

          <div
            v-if="hasGrade || hasValidation"
            class="av-row av-align-center av-wrap av-gap-xs"
          >
            <div
              v-if="hasGrade"
              class="av-col av-gap-sm"
            >
              <AvMessage
                :message="t('student.activities.views.ActivityView.ReceivedAssessmentSection.gradeMessage')"
                type="info"
              />
              <AvBadge
                :label="gradeLabel"
                :icon="MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER"
                color="var(--dark-foreground)"
                background-color="var(--dark-background-primary1)"
                data-testid="received-assessment-card-grade"
              />
            </div>

            <AvBadge
              v-if="hasValidation"
              v-bind="validationBadgeProps"
              border-color="transparent"
              data-testid="received-assessment-card-validation"
            />
          </div>

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
      radius="var(--radius-lg)"
      data-testid="received-assessment-section-status"
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
</style>
