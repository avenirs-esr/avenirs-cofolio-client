<script lang="ts" setup>
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import FeedbackInfoCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/FeedbackInfoCard/FeedbackInfoCard.vue'
import MyPerspectiveCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/MyPerspectiveCard.vue'
import PerspectiveTabActions
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/interactions/PerspectiveTabActions/PerspectiveTabActions.vue'
import ReceivedFeedbacksSection from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/sections/ReceivedFeedbacksSection/ReceivedFeedbacksSection.vue'

export interface MyPerspectiveTabProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveTabProps>()
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="my-perspective-tab"
  >
    <div class="av-pt-md">
      <MyPerspectiveCard
        :activity-id="declaredActivityDetails.id"
        :perspective="declaredActivityDetails.reflection"
        :activity-status="declaredActivityDetails.status"
        :last-feedback-status="declaredActivityDetails.feedbacks?.at(-1)?.status"
      />
    </div>

    <FeedbackInfoCard
      v-if="declaredActivityDetails.activity.feedbackAllowedIterations !== 0"
      :activity="declaredActivityDetails"
    />

    <PerspectiveTabActions
      :declared-activity-details="declaredActivityDetails"
    />

    <ReceivedFeedbacksSection
      v-if="declaredActivityDetails.activity.feedbackAllowedIterations !== 0"
      :declared-activity-details="declaredActivityDetails"
    />
  </div>
</template>
