import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { MutationArgs } from '@/types'
import { type ActivityDetailDTO, type ActivityNavigationDTO, getActivityDetail, getActivityNavigation, unsubscribeActivityProgresses } from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { commonQueryKeys } from '@/features/student/global'
import { useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const activitiesCommonQueryKey = [...commonQueryKeys, 'activities']
const activityDetailsQueryKey = [...activitiesCommonQueryKey, 'details']
const activityNavigationQueryKey = [...activitiesCommonQueryKey, 'navigation']

export interface UnsubscribeActivitiesVariables {
  activitiesIds: string[]
}

export function useUnsubscribeActivitiesMutation ({ onError, onSuccess }: MutationArgs<string, UnsubscribeActivitiesVariables> = {}) {
  const invalidateQueryKey = useInvalidateQuery()
  return useMutation<string, BaseApiException, UnsubscribeActivitiesVariables>({
    mutationFn: async ({ activitiesIds }: UnsubscribeActivitiesVariables): Promise<string> => {
      return await unsubscribeActivityProgresses(activitiesIds)
    },
    onSuccess: async (data, variables) => {
      await Promise.all(
        variables.activitiesIds.map(activityId => invalidateQueryKey([...activityDetailsQueryKey, activityId])),
      )
      onSuccess?.(data, variables)
    },
    onError
  })
}

export function useActivityDetailQuery (activityId: MaybeRef<string>) {
  const queryKey = computed(() => [...activityDetailsQueryKey, toValue(activityId)])

  const queryFn = computed(() => async (): Promise<ActivityDetailDTO> => {
    return await getActivityDetail(toValue(activityId))
  })

  const query = useQuery<ActivityDetailDTO, BaseApiException>({
    queryKey,
    queryFn,
    enabled: computed(() => toValue(activityId).trim().length > 0),
  })

  const activityDetail = computed(() => query.data.value)

  return {
    ...query,
    activityDetail,
  }
}

export function useActivitiesNavigationQuery (): UseQueryReturnType<ActivityNavigationDTO[], BaseApiException> & {
  activities: Ref<ActivityNavigationDTO[]>
} {
  const queryKey = computed(() => [...activityNavigationQueryKey])

  const queryFn = computed(() => async (): Promise<ActivityNavigationDTO[]> => {
    return await getActivityNavigation()
  })

  const query = useQuery<ActivityNavigationDTO[], BaseApiException>({ queryKey, queryFn })

  const activities = computed(() => query.data.value ?? [])

  return {
    ...query,
    activities,
  }
}
