<script lang="ts" setup>
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import MyPerspectiveCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/MyPerspectiveCard.vue'
import PerspectiveTabActions
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/interactions/PerspectiveTabActions/PerspectiveTabActions.vue'

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
      />
    </div>

    <PerspectiveTabActions
      :declared-activity-details="declaredActivityDetails"
    />
  </div>
</template>
