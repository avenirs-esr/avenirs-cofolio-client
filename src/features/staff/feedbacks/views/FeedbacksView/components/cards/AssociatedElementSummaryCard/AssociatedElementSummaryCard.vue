<script setup lang="ts">
import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { EAssociationContextType, EUserCategory, useGetFeedbackDetails } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import AssociatedElementCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementCard/AssociatedElementCard.vue'
import { AvCard } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface AssociatedElementSummaryCardProps {
  feedbackId: string
}

const { feedbackId } = defineProps<AssociatedElementSummaryCardProps>()
const { t } = useI18n()

const { data: feedbackDetails, isLoading, error } = useGetFeedbackDetails(EUserCategory.STAFF, feedbackId)

const associatedElements = computed<FeedbackAssociatedElement[]>(() => {
  if (!feedbackDetails.value) {
    return []
  }

  const traces = (feedbackDetails.value.associatedTraces ?? []).map(trace => ({
    type: EAssociationContextType.TRACE as const,
    data: trace,
  }))

  const skills = (feedbackDetails.value.associatedDeclaredSkills ?? []).map(skill => ({
    type: EAssociationContextType.DECLARED_SKILL as const,
    data: skill,
  }))

  return [...traces, ...skills]
})
</script>

<template>
  <AvCard
    collapsible
    :collapsed="false"
    data-testid="feedback-associated-elements-card"
  >
    <template #title>
      {{ t('staff.feedbacks.cards.AssociatedElementSummaryCard.title', { count: associatedElements.length }) }}
    </template>

    <QuerySuspense
      :is-loading="isLoading"
      :is-empty="associatedElements.length === 0"
      :empty-state-message="t('staff.feedbacks.cards.AssociatedElementSummaryCard.emptyState')"
      :error="error"
    >
      <AssociatedElementCard
        v-for="element in associatedElements"
        :key="element.data.id"
        :feedback-associated-element="element"
      />
    </QuerySuspense>
  </AvCard>
</template>
