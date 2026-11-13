<script setup lang="ts">
import type { DeclaredActivityDetailsDTO, SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import { QuerySuspense } from '@avenirs-esr/shared'
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
  <QuerySuspense
    :error="error"
    :is-loading="isLoading && !isError"
    data-testid="sub-activity-details"
  >
    <template #error>
      <ActivityErrorMessage :error="error" />
    </template>

    <ActivityDetails
      v-if="subActivityDetails"
      :declared-activity-details="subActivityDetails"
    />
  </QuerySuspense>
</template>
