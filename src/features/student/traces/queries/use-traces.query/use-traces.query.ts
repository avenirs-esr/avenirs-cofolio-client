import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import {
  associateTraceWithActivities,
  associateTraceWithDeclaredSkill,
  type AssociationsCreationRequest,
  type AssociationSearchResultDeclaredActivityDTO,
  type AssociationSearchResultDeclaredSkillIDTO,
  createTrace,
  type CreateTraceDTO,
  deleteTrace,
  deleteTraceAssociations,
  getTraceAssociations,
  getTraceConfig,
  getTraceDetail,
  getTraceOverview,
  getTracesSummary,
  type PagedResponseAssociationSearchResultDeclaredActivityDTO,
  type PagedResponseAssociationSearchResultDeclaredSkillIDTO,
  type PagedResponseTraceViewDTO,
  searchDeclaredActivityForAssociation,
  type SearchDeclaredActivityForAssociationParams,
  searchDeclaredSkillForAssociation,
  type SearchDeclaredSkillForAssociationParams,
  type TraceAssociationsDTO,
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
import { keepPreviousData, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const tracesCommonQueryKeys = [...commonQueryKeys, 'traces']
const traceDetailQueryKey = [...tracesCommonQueryKeys, 'trace-detailed']
const traceAssociationsQueryKey = [...tracesCommonQueryKeys, 'associations']
const tracesViewQueryKey = [...tracesCommonQueryKeys, 'view']
const tracesSearchAssociationActivitiesQueryKey = [...tracesCommonQueryKeys, 'search-association-activities']
const tracesSearchAssociationSkillsQueryKey = [...tracesCommonQueryKeys, 'search-association-skills']

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

export interface SearchActivitiesForAssociationQueryParams {
  traceId: MaybeRef<string>
  params?: MaybeRef<SearchDeclaredActivityForAssociationParams | undefined>
  enabled?: MaybeRef<boolean>
}

export type SearchActivitiesForAssociationQueryReturnType =
  UseQueryReturnType<PagedResponseAssociationSearchResultDeclaredActivityDTO, BaseApiException> & {
    activities: Ref<AssociationSearchResultDeclaredActivityDTO[]>
    pageInfo: Ref<{
      page: number
      pageSize: number
      totalElements: number
      totalPages: number
    }>
  }

export function useSearchActivitiesForAssociationQuery ({
  traceId,
  params,
  enabled
}: SearchActivitiesForAssociationQueryParams): SearchActivitiesForAssociationQueryReturnType {
  const queryKey = computed(() => [
    ...tracesSearchAssociationActivitiesQueryKey,
    toValue(traceId),
    toValue(params)
  ])

  const queryFn = computed(() => async (): Promise<PagedResponseAssociationSearchResultDeclaredActivityDTO> => {
    return await searchDeclaredActivityForAssociation(toValue(traceId), toValue(params))
  })

  const query = useQuery<PagedResponseAssociationSearchResultDeclaredActivityDTO, BaseApiException>({
    queryKey,
    queryFn,
    enabled: computed(() => (enabled === undefined || toValue(enabled)) && toValue(traceId).trim().length > 0),
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

export interface AssociateTraceWithActivitiesVariables {
  traceId: string
  associationsCreationRequest: AssociationsCreationRequest
}

export function useAssociateTraceWithActivitiesMutation ({
  onError,
  onSuccess
}: MutationArgs<TraceAssociationsDTO, AssociateTraceWithActivitiesVariables> = {}) {
  const invalidateQueryKey = useInvalidateQuery()

  return useMutation<TraceAssociationsDTO, BaseApiException, AssociateTraceWithActivitiesVariables>({
    mutationFn: async ({
      traceId,
      associationsCreationRequest
    }: AssociateTraceWithActivitiesVariables): Promise<TraceAssociationsDTO> => {
      return await associateTraceWithActivities(traceId, associationsCreationRequest)
    },
    onSuccess: async (data, variables) => {
      await invalidateQueryKey([...traceAssociationsQueryKey, variables.traceId])
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UseDeclaredSkillsForAssociationQueryParams {
  traceId: MaybeRef<string>
  params?: MaybeRef<SearchDeclaredSkillForAssociationParams | undefined>
  enabled?: MaybeRef<boolean>
}

export type SearchDeclaredSkillsForAssociationWithTraceQueryReturnType =
  UseQueryReturnType<PagedResponseAssociationSearchResultDeclaredSkillIDTO, BaseApiException> & {
    skills: Ref<AssociationSearchResultDeclaredSkillIDTO[]>
    pageInfo: Ref<{
      page: number
      pageSize: number
      totalElements: number
      totalPages: number
    }>
  }

export function useSearchDeclaredSkillsForAssociationWithTraceQuery ({
  traceId,
  params,
  enabled
}: UseDeclaredSkillsForAssociationQueryParams): SearchDeclaredSkillsForAssociationWithTraceQueryReturnType {
  const queryKey = computed(() => [
    ...tracesSearchAssociationSkillsQueryKey,
    toValue(traceId),
    toValue(params)
  ])

  const queryFn = computed(() => async (): Promise<PagedResponseAssociationSearchResultDeclaredSkillIDTO> => {
    return await searchDeclaredSkillForAssociation(toValue(traceId), toValue(params))
  })

  const query = useQuery<PagedResponseAssociationSearchResultDeclaredSkillIDTO, BaseApiException>({
    queryKey,
    queryFn,
    enabled: computed(() => (enabled === undefined || toValue(enabled)) && toValue(traceId).trim().length > 0),
    placeholderData: keepPreviousData
  })

  const skills = computed(() => query.data.value?.data ?? [])

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
    skills,
    pageInfo
  }
}

export interface AssociateTraceWithDeclaredSkillsVariables {
  traceId: string
  associationsCreationRequest: AssociationsCreationRequest
}

export function useAssociateTraceWithDeclaredSkillsMutation ({
  onError,
  onSuccess
}: MutationArgs<TraceAssociationsDTO, AssociateTraceWithDeclaredSkillsVariables> = {}) {
  const invalidateQueryKey = useInvalidateQuery()

  return useMutation<TraceAssociationsDTO, BaseApiException, AssociateTraceWithDeclaredSkillsVariables>({
    mutationFn: async ({
      traceId,
      associationsCreationRequest
    }: AssociateTraceWithDeclaredSkillsVariables): Promise<TraceAssociationsDTO> => {
      return await associateTraceWithDeclaredSkill(traceId, associationsCreationRequest)
    },
    onSuccess: async (data, variables) => {
      await invalidateQueryKey([...traceAssociationsQueryKey, variables.traceId])
      onSuccess?.(data, variables)
    },
    onError
  })
}
