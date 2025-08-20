import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'
import {
  createTrace,
  type CreateTraceDTO,
  CreateTraceDTOLanguage,
  deleteTrace,
  getTraceConfigInfo,
  getTracesUnassociatedSummary,
  getTracesView,
  GetTracesViewStatus,
  type TraceConfigurationInfo,
  type TracesCreationResponse,
  type TracesViewResponse,
  type TraceViewDTO,
  type UnassociatedTracesSummaryDTO,
  uploadAttachment,
  type UploadAttachmentBody
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { keepPreviousData, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student', 'traces']
const unassignedTracesQueryKey = [...commonQueryKeys, 'unassigned']
const TWO_MINUTES = 2 * 60 * 1000

export function useUnassignedTracesViewQuery (
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<TracesViewResponse, BaseApiException> & {
  traces: Ref<TraceViewDTO[]>
  pageInfo: Ref<TracesViewResponse['page']>
} {
  const queryKey = computed(() => [...unassignedTracesQueryKey, { page: page.value, pageSize: pageSize.value }])

  const query = useQuery<TracesViewResponse, BaseApiException, TracesViewResponse, readonly unknown[]>({
    queryKey,
    queryFn: async (): Promise<TracesViewResponse> => {
      return await getTracesView({
        pageSize: pageSize.value,
        page: page.value,
        status: GetTracesViewStatus.UNASSOCIATED
      })
    },
    staleTime: TWO_MINUTES,
    placeholderData: keepPreviousData
  })

  const traces = computed(() => query.data.value?.data.traces ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    traces,
    pageInfo,
  }
}

export function useUnassignedTracesSummaryQuery (): UseQueryReturnType<UnassociatedTracesSummaryDTO, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'unassigned', 'summary'])

  return useQuery<UnassociatedTracesSummaryDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<UnassociatedTracesSummaryDTO> => {
      return await getTracesUnassociatedSummary()
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

export function useTracesConfigurationQuery (): UseQueryReturnType<TraceConfigurationInfo, BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'config'])
  return useQuery<TraceConfigurationInfo, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<TraceConfigurationInfo> => {
      return await getTraceConfigInfo()
    },
    staleTime: TWO_MINUTES,
  })
}

export interface CreateTraceVariables {
  title: string
  personalNote?: string
  language?: CreateTraceDTOLanguage
}

export interface UseCreateTraceMutationArgs {
  onSuccess?: (data: TracesCreationResponse) => void
  onError?: (error: BaseApiException) => void
}

export function useCreateTraceMutation ({ onError, onSuccess }: UseCreateTraceMutationArgs = {}) {
  const invalidateUnassignedTracesViewQuery = useInvalidateQuery(unassignedTracesQueryKey)

  return useMutation<TracesCreationResponse, BaseApiException, CreateTraceVariables>({
    mutationFn: async ({ title, personalNote, language = CreateTraceDTOLanguage.FRENCH }: CreateTraceVariables): Promise<TracesCreationResponse> => {
      const createTraceDTO: CreateTraceDTO = {
        title,
        language: language as CreateTraceDTOLanguage,
        personalNote,
        isGroup: false
      }
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
