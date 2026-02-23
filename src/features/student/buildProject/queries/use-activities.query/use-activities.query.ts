import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { MutationArgs } from '@/types'
import { type ActivityDetailDTO, type ActivityNavigationDTO, getActivityDetail, getActivityNavigation, getDeclaredActivitiesView, type GetDeclaredActivitiesViewParams, type PagedResponseDeclaredActivityViewDTO, unsubscribeActivityProgresses } from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { commonQueryKeys } from '@/features/student/global'
import { useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const activitiesCommonQueryKey = [...commonQueryKeys, 'activities']
const activityDetailsQueryKey = [...activitiesCommonQueryKey, 'details']
const libraryActivitiesQueryKey = [...activitiesCommonQueryKey, 'library']
const activityNavigationQueryKey = [...activitiesCommonQueryKey, 'navigation']

function useLibraryActivitiesCommonQueryOptions (params?: MaybeRef<GetDeclaredActivitiesViewParams>) {
  return {
    queryKey: computed(() => [...libraryActivitiesQueryKey, toValue(params)]),
    queryFn: computed(() => async (): Promise<PagedResponseDeclaredActivityViewDTO> => getDeclaredActivitiesView(toValue(params))),
  }
}

export function useLibraryActivitiesQuery (params?: MaybeRef<GetDeclaredActivitiesViewParams>) {
  const query = useQuery<PagedResponseDeclaredActivityViewDTO, BaseApiException>({
    ...useLibraryActivitiesCommonQueryOptions(params),
  })

  const libraryActivities = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page)
  const totalElements = computed(() => query.data.value?.page.totalElements ?? 0)

  return {
    ...query,
    libraryActivities,
    pageInfo,
    totalElements
  }
}

/**
 * this query is used to get only the count, thanks to tanstack query deduplication, only one request will be made if both useLibraryActivitiesQuery and useCountLibraryActivities are used at the same time with the same params
 */
export function useCountLibraryActivities (params?: MaybeRef<GetDeclaredActivitiesViewParams>) {
  return useQuery<PagedResponseDeclaredActivityViewDTO, BaseApiException, number>({
    ...useLibraryActivitiesCommonQueryOptions(params),
    select: data => data.page.totalElements,
  })
}

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
