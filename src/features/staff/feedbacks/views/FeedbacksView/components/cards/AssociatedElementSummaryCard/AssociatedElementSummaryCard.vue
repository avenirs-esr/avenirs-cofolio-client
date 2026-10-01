<script setup lang="ts">
import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import { EAssociationContextType, EUserCategory, useGetFeedbackDetails } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import Card from '@/common/components/cards/Card/Card.vue'
import { ICONS } from '@/common/constants'
import AssociatedElementCard from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/AssociatedElementCard/AssociatedElementCard.vue'
import AssociatedElementDetailsDrawer
  from '@/features/staff/feedbacks/views/FeedbacksView/components/drawers/AssociatedElementDetailsDrawer/AssociatedElementDetailsDrawer.vue'
import { AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociatedElementSummaryCardProps {
  feedbackId: string
}

const { feedbackId } = defineProps<AssociatedElementSummaryCardProps>()
const { t } = useI18n()
const selectedElement = ref<FeedbackAssociatedElement>()

const { data: feedbackDetails, isLoading, error } = useGetFeedbackDetails(EUserCategory.STAFF, feedbackId)

const associatedElements = computed<FeedbackAssociatedElement[]>(() => {
  if (!feedbackDetails.value) {
    return []
  }

  const associations = feedbackDetails.value.associations

  const traces = associations.traces.map(trace => ({
    type: EAssociationContextType.TRACE as const,
    data: trace,
  }))

  const skills = associations.declaredSkills.map(skill => ({
    type: EAssociationContextType.DECLARED_SKILL as const,
    data: skill,
  }))

  const experiences = associations.declaredExperiences.map(experience => ({
    type: EAssociationContextType.DECLARED_EXPERIENCE as const,
    data: experience,
  }))

  return [...traces, ...skills, ...experiences]
})

function handleShowDetails (element: FeedbackAssociatedElement) {
  selectedElement.value = element
}

function closeDetailsDrawer () {
  selectedElement.value = undefined
}
</script>

<template>
  <Card
    title-background="var(--card2)"
    border-color="var(--other-border-skill-card)"
    collapsible
    :collapsed="false"
    data-testid="feedback-associated-elements-card"
  >
    <template #title>
      <AvIconText
        typography-class="n4"
        :icon="ICONS.ASSOCIATIONS"
        icon-color="var(--dark-background-primary1)"
        :text="t('staff.feedbacks.cards.AssociatedElementSummaryCard.title', { count: associatedElements.length })"
        text-color="var(--text1)"
        gap="var(--spacing-sm)"
        data-testid="feedback-associated-elements-card-title"
      />
    </template>

    <QuerySuspense
      :is-loading="isLoading"
      :is-empty="associatedElements.length === 0"
      :empty-state-message="t('staff.feedbacks.cards.AssociatedElementSummaryCard.emptyState')"
      :error="error"
    >
      <div class="av-col av-gap-sm">
        <AssociatedElementCard
          v-for="element in associatedElements"
          :key="element.data.id"
          :feedback-associated-element="element"
          @show-details="handleShowDetails"
        />
      </div>
    </QuerySuspense>
  </Card>

  <AssociatedElementDetailsDrawer
    v-if="selectedElement"
    :feedback-associated-element="selectedElement"
    @close="closeDetailsDrawer"
  />
</template>
