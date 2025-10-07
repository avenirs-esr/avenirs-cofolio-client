import type { BaseApiException } from '@/common/exceptions'
import {
  associate,
  type AssociateTraceDTO,
  type AssociationsTraceDTO,
  createTrace,
  type CreateTraceDTO,
  deleteTrace,
  type ETraceAssociationType,
  getAssociatedTraces,
  getTraceAssociations,
  getTraceConfig,
  getTraceDetail,
  getTracesSummary,
  getTracesView,
  type GetTracesViewStatus,
  type PagedResponseTraceAssociationSearchResult,
  type PagedResponseTraceViewDTO,
  type TraceAssociationSearchResult,
  type TraceConfigurationDTO,
  type TraceDetailDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO,
  type TraceViewDTO,
  uploadAttachment,
  type UploadAttachmentBody
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { keepPreviousData, type QueryKey, useInfiniteQuery, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue, type UnwrapRef } from 'vue'

const commonQueryKeys = ['user', 'student', 'traces']
const unassignedTracesQueryKey = [...commonQueryKeys, 'unassigned']
const TWO_MINUTES = 2 * 60 * 1000

interface UseTracesViewQueryParams {
  page: Ref<number>
  pageSize: Ref<number>
  status: MaybeRef<GetTracesViewStatus>
}

type UseTracesViewQueryReturn = UseQueryReturnType<PagedResponseTraceViewDTO, BaseApiException> & {
  traces: Ref<TraceViewDTO[]>
  pageInfo: Ref<PagedResponseTraceViewDTO['page']>
}

export function useTracesViewQuery ({ page, pageSize, status }: UseTracesViewQueryParams): UseTracesViewQueryReturn {
  const queryKey = computed(() => [...unassignedTracesQueryKey, { page: page.value, pageSize: pageSize.value, status: toValue(status) }])

  const query = useQuery<PagedResponseTraceViewDTO, BaseApiException, PagedResponseTraceViewDTO, readonly unknown[]>({
    queryKey,
    queryFn: async (): Promise<PagedResponseTraceViewDTO> => {
      return await getTracesView({
        pageSize: pageSize.value,
        page: page.value,
        status: toValue(status)
      })
    },
    staleTime: TWO_MINUTES,
    placeholderData: keepPreviousData
  })

  const traces = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    traces,
    pageInfo,
  }
}

export function useTracesSummaryQuery (): UseQueryReturnType<TracesSummaryDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'summary'])

  return useQuery<TracesSummaryDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<TracesSummaryDTO> => {
      return await getTracesSummary()
    },
    staleTime: TWO_MINUTES,
  })
}

export interface DeleteTraceVariables {
  traceId: string
}

export interface UseDeleteTraceMutationArgs {
  onSuccess?: () => void
  onError?: (error: BaseApiException) => void
}

export function useDeleteTraceMutation ({ onError, onSuccess }: UseDeleteTraceMutationArgs = {}) {
  const invalidateUnassignedTracesViewQuery = useInvalidateQuery(unassignedTracesQueryKey)
  return useMutation<string, BaseApiException, DeleteTraceVariables>({
    mutationFn: async ({ traceId }: DeleteTraceVariables): Promise<string> => {
      return await deleteTrace(traceId)
    },
    onSuccess: async () => {
      await invalidateUnassignedTracesViewQuery()
      onSuccess?.()
    },
    onError
  })
}

export function useTracesConfigurationQuery (): UseQueryReturnType<TraceConfigurationDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'config'])
  return useQuery<TraceConfigurationDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<TraceConfigurationDTO> => {
      return await getTraceConfig()
    },
    staleTime: TWO_MINUTES,
  })
}

export interface UseCreateTraceMutationArgs {
  onSuccess?: (data: TracesCreationResponse) => void
  onError?: (error: BaseApiException) => void
}

export function useCreateTraceMutation ({ onError, onSuccess }: UseCreateTraceMutationArgs = {}) {
  const invalidateUnassignedTracesViewQuery = useInvalidateQuery(unassignedTracesQueryKey)

  return useMutation<TracesCreationResponse, BaseApiException, CreateTraceDTO>({
    mutationFn: async (createTraceDTO: CreateTraceDTO): Promise<TracesCreationResponse> => {
      return await createTrace(createTraceDTO)
    },
    onSuccess: async (data) => {
      await invalidateUnassignedTracesViewQuery()
      onSuccess?.(data)
    },
    onError
  })
}

export interface UploadAttachmentVariables {
  traceId: string
  file: File
}

export interface UseUploadAttachmentMutationArgs {
  onSuccess?: () => void
  onError?: (error: BaseApiException) => void
}

export function useUploadAttachmentMutation ({ onError, onSuccess }: UseUploadAttachmentMutationArgs = {}) {
  return useMutation<void, BaseApiException, UploadAttachmentVariables>({
    mutationFn: async ({ traceId, file }: UploadAttachmentVariables): Promise<void> => {
      const uploadAttachmentBody: UploadAttachmentBody = { file }
      await uploadAttachment(traceId, uploadAttachmentBody)
    },
    onSuccess,
    onError
  })
}

export function useTraceDetailedQuery (traceId: Ref<string>) {
  const queryKey = computed(() => [...commonQueryKeys, 'trace-detailed', traceId.value])

  const queryFn = computed(() => async (): Promise<TraceDetailDTO> => {
    return await getTraceDetail(toValue(traceId))
  })

  const query = useQuery<TraceDetailDTO, BaseApiException, TraceDetailDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES,
    enabled: computed(() => traceId.value.trim().length > 0),
  })

  const traceDetailed = computed(() => query.data.value)

  return {
    ...query,
    traceDetailed,
  }
}

export function useTracesAssociationQuery (
  associationType: Ref<ETraceAssociationType>,
  keyword: Ref<string>,
  pageSize: Ref<number>
) {
  const queryKey = computed(() => [
    ...commonQueryKeys,
    'association',
    {
      associationType: associationType.value,
      keyword: keyword.value,
      pageSize: pageSize.value,
    },
  ])

  const queryFn = computed(
    () =>
      async ({ pageParam = 0 }): Promise<PagedResponseTraceAssociationSearchResult> =>
        await getAssociatedTraces(associationType.value, {
          keyword: toValue(keyword),
          page: pageParam,
          pageSize: toValue(pageSize)
        })
  )

  const query = useInfiniteQuery<
    PagedResponseTraceAssociationSearchResult,
    BaseApiException,
    TraceAssociationSearchResult[],
    Readonly<UnwrapRef<typeof queryKey>>,
    number
  >({
    queryKey,
    queryFn,
    enabled: computed(() => keyword.value.trim().length >= 3),
    staleTime: TWO_MINUTES,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.page
      return page + 1 < totalPages ? page + 1 : undefined
    },
    select: data => data.pages.flatMap(p => p.data)
  })

  const associations = computed(() => (keyword.value.trim().length >= 3 ? query.data.value ?? [] : []))

  return {
    ...query,
    associations
  }
}

export interface UseCreateAssociateTraceMutationArgs {
  onSuccess?: () => void
  onError?: (error: BaseApiException) => void
}

export interface UseCreateAssociateTraceMutationVariables {
  traceId: string
  associateTraceDTO: AssociateTraceDTO
}

export function useCreateAssociateTraceMutation ({ onError, onSuccess }: UseCreateAssociateTraceMutationArgs = {}) {
  const invalidateAssociateTracesViewQuery = useInvalidateQuery([...commonQueryKeys, 'associate'])

  return useMutation<void, BaseApiException, UseCreateAssociateTraceMutationVariables>({
    mutationFn: async ({ traceId, associateTraceDTO }): Promise<void> => {
      await associate(traceId, associateTraceDTO)
    },
    onSuccess: async () => {
      await invalidateAssociateTracesViewQuery()
      onSuccess?.()
    },
    onError
  })
}

export function useTraceAssociationsQuery (traceId: Ref<string>, enabled: Ref<boolean>) {
  const queryKey = computed(() => [...commonQueryKeys, 'trace-associations', traceId.value])

  const queryFn = computed(() => async (): Promise<AssociationsTraceDTO> => {
    return await getTraceAssociations(toValue(traceId))
  })

  const query = useQuery<AssociationsTraceDTO, BaseApiException, AssociationsTraceDTO, QueryKey>({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES,
    enabled: computed(() => traceId.value.trim().length > 0 && enabled.value),
  })

  const skillLevelAssociations = computed(() => query.data.value?.skillLevelAssociations ?? [])
  const additionalSkillAssociations = computed(() => query.data.value?.additionalSkillAssociations ?? [])

  return {
    ...query,
    skillLevelAssociations,
    additionalSkillAssociations,
  }
}
