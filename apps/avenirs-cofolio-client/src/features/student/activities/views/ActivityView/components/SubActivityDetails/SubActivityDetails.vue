<script setup lang="ts">
import type { DeclaredActivityDetailsDTO, SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { Loader } from '@avenirs-esr/shared'
import { useGetSubActivityDetails } from '@avenirs-esr/shared/api/avenir-esr'
import ActivityErrorMessage from '@/features/student/activities/components/errors/ActivityErrorMessage/ActivityErrorMessage.vue'
import ActivityDetails
  from '@/features/student/activities/views/ActivityView/components/ActivityDetails/ActivityDetails.vue'
import { TanstackStaleTimeConfig } from '@/plugins/tanstack-query/config'

export interface SubActivityDetailsProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
  subActivity: SubActivityOverviewDTO
}

const { declaredActivityDetails, subActivity } = defineProps<SubActivityDetailsProps>()

const { data: subActivityContent, isLoading, isError, error } = useGetSubActivityDetails(
  () => declaredActivityDetails.id,
  () => subActivity.id,
  { query: { staleTime: TanstackStaleTimeConfig.DETAILS } },
)

const subActivityDetails = computed<DeclaredActivityDetailsDTO | undefined>(() => subActivityContent.value
  ? { ...declaredActivityDetails, activity: subActivityContent.value }
  : undefined,
)
</script>

<template>
  <div data-testid="sub-activity-details">
    <Loader
      :is-loading="isLoading && !isError"
      size="2xl"
    >
      <ActivityDetails
        v-if="subActivityDetails"
        :declared-activity-details="subActivityDetails"
      />
    </Loader>

    <ActivityErrorMessage :error="error" />
  </div>
</template>
