<script lang="ts" setup>
import { type DeclaredActivityDetailsDTO, EFeedbackStatus } from '@/api/avenir-esr'
import FeedbackCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/FeedbackCard/FeedbackCard.vue'
import { AvCard } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ReceivedFeedbacksSectionProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<ReceivedFeedbacksSectionProps>()
const { t } = useI18n()

const submittedFeedbacks = computed(() =>
  declaredActivityDetails.feedbacks?.filter(f => f.status === EFeedbackStatus.SUBMITTED) ?? []
)

const title = computed(() => {
  const count = submittedFeedbacks.value.length
  const max = declaredActivityDetails.activity.feedbackAllowedIterations

  return max === -1
    ? t('student.buildProject.activities.views.ProjectActivityDetailedView.ReceivedFeedbacksSection.titleUnlimited', { count })
    : t('student.buildProject.activities.views.ProjectActivityDetailedView.ReceivedFeedbacksSection.titleLimited', { count, max })
})
</script>

<template>
  <div
    class="av-col av-gap-md"
    data-testid="received-feedbacks-section"
  >
    <span
      class="n4 av-text-text1"
      data-testid="received-feedbacks-section-title"
    >
      {{ title }}
    </span>

    <template v-if="submittedFeedbacks.length">
      <FeedbackCard
        v-for="feedback in submittedFeedbacks"
        :key="feedback.id"
        :feedback="feedback"
      />
    </template>

    <AvCard
      v-else
      background-color="var(--surface-background)"
      border-color="transparent"
      data-testid="received-feedbacks-section-empty"
      class="empty-message-card"
    >
      <span class="b2-light av-text-text2">
        {{ t('student.buildProject.activities.views.ProjectActivityDetailedView.ReceivedFeedbacksSection.empty') }}
      </span>
    </AvCard>
  </div>
</template>

<style lang="scss" scoped>
.empty-message-card {
  border-radius: var(--radius-lg) !important;
}
</style>
