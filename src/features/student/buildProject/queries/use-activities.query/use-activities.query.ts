import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { MutationArgs } from '@/types'
import {
  type ActivityDetailDTO,
  type ActivityNavigationDTO,
  type ActivityOverviewDTO,
  type DeclaredActivity,
  type DeclaredActivityDetailsDTO,
  type EActivityThematic,
  getActivitiesView,
  type GetActivitiesViewParams,
  getActivityDetail,
  getActivityNavigation,
  getDeclaredActivitiesView,
  type GetDeclaredActivitiesViewParams,
  getDeclaredActivityDetails,
  getLatestActivitiesView,
  type PagedResponseActivityOverviewDTO,
  type PagedResponseDeclaredActivityViewDTO,
  subscribeActivity,
  unsubscribeActivitiesProgresses
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type ComputedRef, type MaybeRef, type Ref, toValue } from 'vue'

const activitiesCommonQueryKey = [...commonQueryKeys, 'activities']
const activityDetailsQueryKey = [...activitiesCommonQueryKey, 'details']
const libraryActivitiesQueryKey = [...activitiesCommonQueryKey, 'library']
const activityNavigationQueryKey = [...activitiesCommonQueryKey, 'navigation']
const activitiesViewQueryKey = [...activitiesCommonQueryKey, 'view']

export interface ActivitiesViewQueryParams {
  thematic?: MaybeRef<EActivityThematic | undefined>
  page: MaybeRef<number>
  pageSize: MaybeRef<number>
}

export type ActivitiesViewQueryReturnType = UseQueryReturnType<PagedResponseActivityOverviewDTO, BaseApiException> & {
  activities: Ref<ActivityOverviewDTO[]>
  pageInfo: Ref<{
    page: number
    pageSize: number
    totalElements: number
    totalPages: number
  }>
}

export function useActivitiesViewQuery ({
  thematic,
  page,
  pageSize
}: ActivitiesViewQueryParams): ActivitiesViewQueryReturnType {
  useInvalidateQuery([...activitiesViewQueryKey])
  const queryKey = computed(() => [
    ...activitiesViewQueryKey,
    {
      thematic: toValue(thematic),
      page: toValue(page),
      pageSize: toValue(pageSize)
    }
  ])

  const queryFn = computed(() => async (): Promise<PagedResponseActivityOverviewDTO> => {
    return await getActivitiesView({
      thematic: toValue(thematic),
      page: toValue(page),
      pageSize: toValue(pageSize)
    } as GetActivitiesViewParams)
  })

  const query = useQuery<PagedResponseActivityOverviewDTO, BaseApiException>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData
  })

  const activities = computed(() => query.data.value?.data ?? [])

  const pageInfo = computed(() =>
    query.data.value?.page ?? {
      page: 0,
      pageSize: 0,
      totalElements: 0,
      totalPages: 0
    }
  )

  return {
    ...query,
    activities,
    pageInfo
  }
}

export interface ActivitiesLatestViewQueryParams {
  page: MaybeRef<number>
  pageSize: number
}

export function useActivitiesLastestViewQuery ({ page, pageSize }: ActivitiesLatestViewQueryParams): ActivitiesViewQueryReturnType {
  const queryKey = computed(() => [
    ...activitiesViewQueryKey,
    {
      page: toValue(page),
      pageSize
    }
  ])

  const queryFn = computed(() => async (): Promise<PagedResponseActivityOverviewDTO> => {
    return await getLatestActivitiesView({
      page: toValue(page),
      pageSize: toValue(3)
    })
  })

  const query = useQuery<PagedResponseActivityOverviewDTO, BaseApiException>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData
  })

  const activities = computed(() => query.data.value?.data ?? [])

  const pageInfo = computed(() =>
    query.data.value?.page ?? {
      page: 0,
      pageSize: 0,
      totalElements: 0,
      totalPages: 0
    }
  )

  return {
    ...query,
    activities,
    pageInfo
  }
}

function useLibraryActivitiesCommonQueryOptions (params?: MaybeRef<GetDeclaredActivitiesViewParams>) {
  return {
    queryKey: computed(() => [...libraryActivitiesQueryKey, toValue(params)]),
    queryFn: computed(() => async (): Promise<PagedResponseDeclaredActivityViewDTO> => getDeclaredActivitiesView(toValue(params))),
  }
}

export function useLibraryActivitiesQuery (params?: MaybeRef<GetDeclaredActivitiesViewParams>, enabled?: ComputedRef<boolean>) {
  const query = useQuery<PagedResponseDeclaredActivityViewDTO, BaseApiException>({
    ...useLibraryActivitiesCommonQueryOptions(params),
    enabled: enabled || true
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

export interface SubscribeActivityVariables {
  activityId: string
}

export function useSubscribeActivityMutation ({ onError, onSuccess }: MutationArgs<DeclaredActivity, SubscribeActivityVariables> = {}) {
  const invalidateQueryKey = useInvalidateQuery()

  return useMutation<DeclaredActivity, BaseApiException, SubscribeActivityVariables>({
    mutationFn: async ({ activityId }: SubscribeActivityVariables): Promise<DeclaredActivity> => {
      // TODO: startDate and endDate US#???
      return await subscribeActivity(activityId, { startDate: new Date().toISOString(), endDate: new Date().toISOString() })
    },
    onSuccess: async (data, variables) => {
      await invalidateQueryKey([...activityDetailsQueryKey, variables.activityId])
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UnsubscribeActivitiesVariables {
  activitiesIds: string[]
}

export function useUnsubscribeActivitiesMutation ({ onError, onSuccess }: MutationArgs<string, UnsubscribeActivitiesVariables> = {}) {
  const invalidateQueryKey = useInvalidateQuery()
  return useMutation<string, BaseApiException, UnsubscribeActivitiesVariables>({
    mutationFn: async ({ activitiesIds }: UnsubscribeActivitiesVariables): Promise<string> => {
      return await unsubscribeActivitiesProgresses(activitiesIds)
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

export function useDeclaredActivitiesDetailedQuery (declaredActivityId: MaybeRef<string>) {
  const queryKey = computed(() => [...activityDetailsQueryKey, toValue(declaredActivityId)])

  const queryFn = computed(() => async (): Promise<DeclaredActivityDetailsDTO> => {
    return await getDeclaredActivityDetails(toValue(declaredActivityId))
  })

  const query = useQuery<DeclaredActivityDetailsDTO, BaseApiException>({
    queryKey,
    queryFn,
    enabled: computed(() => toValue(declaredActivityId).trim().length > 0),
  })

  const declaredActivityDetail = computed(() => query.data.value)

  return {
    ...query,
    declaredActivityDetail,
  }
}
