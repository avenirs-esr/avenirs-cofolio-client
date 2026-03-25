import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import {
  associate,
  type AssociateTraceDTO,
  createTrace,
  type CreateTraceDTO,
  deleteTrace,
  deleteTraceAssociations,
  type ETraceAssociationType,
  getAssociatedTraces,
  getTraceAssociations,
  getTraceConfig,
  getTraceDetail,
  getTraceOverview,
  getTracesSummary,
  type PagedResponseTraceAssociationSearchResult,
  type PagedResponseTraceViewDTO,
  type TraceAssociationsDTO,
  type TraceAssociationSearchResult,
  type TraceConfigurationDTO,
  type TraceDetailDTO,
  type TraceFilter,
  type TraceOverviewDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO,
  tracesView,
  type TracesViewParams,
  type TraceViewDTO,
  updateTrace,
  type UpdateTraceDTO,
  uploadAttachment,
  type UploadAttachmentBody
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { removeEmpty } from '@/common/utils'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue, type UnwrapRef } from 'vue'

const tracesCommonQueryKeys = [...commonQueryKeys, 'traces']
const traceDetailQueryKey = [...tracesCommonQueryKeys, 'trace-detailed']
const traceAssociationsQueryKey = [...tracesCommonQueryKeys, 'associations']
const tracesViewQueryKey = [...tracesCommonQueryKeys, 'view']

export interface UseTracesViewQueryParams {
  params: Ref<TracesViewParams>
  traceFilter: Ref<TraceFilter>
}

type UseTracesViewQueryReturn = UseQueryReturnType<PagedResponseTraceViewDTO, BaseApiException> & {
  traces: Ref<TraceViewDTO[]>
  pageInfo: Ref<PagedResponseTraceViewDTO['page']>
}

export function useTracesViewQuery ({ params, traceFilter }: UseTracesViewQueryParams): UseTracesViewQueryReturn {
  const queryKey = computed(() => [
    ...tracesViewQueryKey,
    toValue(params),
    toValue(traceFilter),
  ])

  const query = useQuery<PagedResponseTraceViewDTO, BaseApiException, PagedResponseTraceViewDTO, readonly unknown[]>({
    queryKey,
    queryFn: async (): Promise<PagedResponseTraceViewDTO> => {
      const cleanFilter = computed(() => removeEmpty(traceFilter.value))
      const cleanParams = computed(() => removeEmpty(params.value))
      return await tracesView(cleanFilter.value, cleanParams.value)
    },
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
  const queryKey = computed(() => [...tracesCommonQueryKeys, 'summary'])

  return useQuery<TracesSummaryDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<TracesSummaryDTO> => {
      return await getTracesSummary()
    },
  })
}

export interface DeleteTraceVariables {
  traceId: string
}

export function useDeleteTraceMutation ({ onError, onSuccess }: MutationArgs = {}) {
  const invalidateTracesViewQuery = useInvalidateQuery(tracesViewQueryKey)
  return useMutation<string, BaseApiException, DeleteTraceVariables>({
    mutationFn: async ({ traceId }: DeleteTraceVariables): Promise<string> => {
      return await deleteTrace(traceId)
    },
    onSuccess: async (data, variables) => {
      await invalidateTracesViewQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export function useTracesConfigurationQuery (): UseQueryReturnType<TraceConfigurationDTO, BaseApiException> {
  const queryKey = computed(() => [...tracesCommonQueryKeys, 'config'])
  return useQuery<TraceConfigurationDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<TraceConfigurationDTO> => {
      return await getTraceConfig()
    },
  })
}

export function useCreateTraceMutation ({ onError, onSuccess }: MutationArgs = {}) {
  const invalidateTracesViewQuery = useInvalidateQuery(tracesViewQueryKey)

  return useMutation<TracesCreationResponse, BaseApiException, CreateTraceDTO>({
    mutationFn: async (createTraceDTO: CreateTraceDTO): Promise<TracesCreationResponse> => {
      return await createTrace(createTraceDTO)
    },
    onSuccess: async (data, variables) => {
      await invalidateTracesViewQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UploadAttachmentVariables {
  traceId: string
  file: File
}

export function useUploadAttachmentMutation ({ onError, onSuccess }: MutationArgs) {
  const invalidateTraceDetailQuery = useInvalidateTraceDetailQuery()
  return useMutation<void, BaseApiException, UploadAttachmentVariables>({
    mutationFn: async ({ traceId, file }: UploadAttachmentVariables): Promise<void> => {
      const uploadAttachmentBody: UploadAttachmentBody = { file }
      await uploadAttachment(traceId, uploadAttachmentBody)
    },
    onSuccess: async (data, variables) => {
      await invalidateTraceDetailQuery(variables.traceId)
      onSuccess?.(data, variables)
    },
    onError
  })
}

export function useTraceDetailedQuery (traceId: MaybeRef<string>) {
  const queryKey = computed(() => [...traceDetailQueryKey, toValue(traceId)])

  const queryFn = computed(() => async (): Promise<TraceDetailDTO> => {
    return await getTraceDetail(toValue(traceId))
  })

  const query = useQuery<TraceDetailDTO, BaseApiException, TraceDetailDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    enabled: computed(() => toValue(traceId).trim().length > 0),
  })

  const traceDetailed = computed(() => query.data.value)

  return {
    ...query,
    traceDetailed,
  }
}

export function useTraceAssociationsQuery (traceId: MaybeRef<string>) {
  const queryKey = computed(() => [...traceAssociationsQueryKey, toValue(traceId)])

  const queryFn = computed(() => async (): Promise<TraceAssociationsDTO> => {
    return getTraceAssociations(toValue(traceId))
  })

  const query = useQuery<TraceAssociationsDTO, BaseApiException, TraceAssociationsDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    enabled: computed(() => toValue(traceId).trim().length > 0),
  })

  const traceAssociations = computed(() => query.data.value)

  return {
    ...query,
    traceAssociations,
  }
}

export function useInvalidateTraceDetailQuery () {
  const invalidateQuery = useInvalidateQuery()

  async function invalidateTraceDetailsQuery (traceId: string) {
    await invalidateQuery([...traceDetailQueryKey, traceId])
  }

  return invalidateTraceDetailsQuery
}

export function useTracesAssociationQuery (
  associationType: Ref<ETraceAssociationType>,
  keyword: Ref<string>,
  pageSize: Ref<number>
) {
  const queryKey = computed(() => [
    ...tracesCommonQueryKeys,
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

export interface UseCreateAssociateTraceMutationVariables {
  traceId: string
  associateTraceDTO: AssociateTraceDTO
}

export function useCreateAssociateTraceMutation ({ onError, onSuccess }: MutationArgs) {
  const invalidateTraceDetailQuery = useInvalidateTraceDetailQuery()

  return useMutation<void, BaseApiException, UseCreateAssociateTraceMutationVariables>({
    mutationFn: async ({ traceId, associateTraceDTO }): Promise<void> => {
      await associate(traceId, associateTraceDTO)
    },
    onSuccess: async (data, variables) => {
      await invalidateTraceDetailQuery(variables.traceId)
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UpdateTraceVariables {
  traceId: string
  updateTraceDTO: UpdateTraceDTO
}

export function useUpdateTraceMutation ({ onError, onSuccess }: MutationArgs<TraceDetailDTO>) {
  const invalidateTraceDetailQuery = useInvalidateTraceDetailQuery()
  const invalidateTracesViewQuery = useInvalidateQuery(tracesViewQueryKey)

  return useMutation<TraceDetailDTO, BaseApiException, UpdateTraceVariables>({
    mutationFn: async ({ traceId, updateTraceDTO }: UpdateTraceVariables): Promise<TraceDetailDTO> => {
      return await updateTrace(traceId, updateTraceDTO)
    },
    onSuccess: async (data, variables) => {
      await invalidateTraceDetailQuery(variables.traceId)
      await invalidateTracesViewQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export function useStudentTracesSummaryQuery (): UseQueryReturnType<TraceOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...tracesCommonQueryKeys, 'summary'])
  return useQuery<TraceOverviewDTO[], BaseApiException, TraceOverviewDTO[], readonly unknown[]>({
    queryKey,
    queryFn: async (): Promise<TraceOverviewDTO[]> => {
      return getTraceOverview()
    }
  })
}

export interface DeleteTraceAssociationsMutationVariables {
  traceId: string
  associationIds: string[]
}

export function useDeleteTraceAssociationsMutation ({
  onError,
  onSuccess
}: MutationArgs<string, DeleteTraceAssociationsMutationVariables> = {}) {
  const invalidateQueryKey = useInvalidateQuery()

  return useMutation<string, BaseApiException, DeleteTraceAssociationsMutationVariables>({
    mutationFn: async ({ traceId, associationIds }): Promise<string> => deleteTraceAssociations(traceId, associationIds),
    onSuccess: async (data, variables) => {
      const { traceId } = variables
      await Promise.all([
        invalidateQueryKey([...traceDetailQueryKey, traceId]),
        invalidateQueryKey([...traceAssociationsQueryKey, traceId])
      ])
      onSuccess?.(data, variables)
    },
    onError
  })
}
