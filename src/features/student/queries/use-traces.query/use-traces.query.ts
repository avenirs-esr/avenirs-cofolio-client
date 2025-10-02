import type { BaseApiException } from '@/common/exceptions'

import {
  createTrace,
  type CreateTraceDTO,
  deleteTrace,
  getTraceConfig,
  getTraceDetail,
  getTracesSummary,
  getTracesView,
  type GetTracesViewStatus,
  type PagedResponseTraceViewDTO,
  type TraceConfigurationDTO,
  type TraceDetailDTO,
  type TracesCreationResponse,
  type TracesSummaryDTO,
  type TraceViewDTO,
  uploadAttachment,
  type UploadAttachmentBody

} from '@/api/avenir-esr'

import { useInvalidateQuery } from '@/common/composables'
import { keepPreviousData, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

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
