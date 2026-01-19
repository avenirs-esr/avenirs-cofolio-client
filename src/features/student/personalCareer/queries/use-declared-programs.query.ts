import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import {
  createDeclaredProgram,
  type DeclaredProgramDetailedDTO,
  type DeclaredProgramRequestDTO,
  type DeclaredProgramViewDTO,
  getDeclaredProgram,
  getDeclaredPrograms,
  type PagedResponseDeclaredProgramViewDTO,
  type PageInfoDTO
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const declaredProgramsCommonQueryKey = [...commonQueryKeys, 'declared-programs']
const declaredProgramsViewQueryKey = [...declaredProgramsCommonQueryKey, 'view']

export interface DeclaredProgramsViewQueryParams {
  page: MaybeRef<number>
  pageSize: MaybeRef<number>
}

export type DeclaredProgramsViewQueryReturnType = UseQueryReturnType<PagedResponseDeclaredProgramViewDTO, BaseApiException> & {
  declaredPrograms: Ref<DeclaredProgramViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
}

export function useDeclaredProgramsViewQuery ({
  page,
  pageSize
}: DeclaredProgramsViewQueryParams): DeclaredProgramsViewQueryReturnType {
  const queryKey = computed(() => [...declaredProgramsViewQueryKey, {
    page: toValue(page),
    pageSize: toValue(pageSize)
  }])

  const queryFn = computed(() => async (): Promise<PagedResponseDeclaredProgramViewDTO> => {
    return await getDeclaredPrograms({
      page: toValue(page),
      pageSize: toValue(pageSize)
    })
  })

  const query = useQuery<PagedResponseDeclaredProgramViewDTO, BaseApiException>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData
  })

  const declaredPrograms = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    declaredPrograms,
    pageInfo
  }
}

export function useCreateDeclaredProgramMutation ({ onError, onSuccess }: MutationArgs = {}) {
  const invalidateDeclaredProgramsViewQuery = useInvalidateQuery([...declaredProgramsViewQueryKey])

  return useMutation<DeclaredProgramViewDTO, BaseApiException, DeclaredProgramRequestDTO>({
    mutationFn: async (declaredProgramRequestDTO: DeclaredProgramRequestDTO): Promise<DeclaredProgramViewDTO> => {
      return await createDeclaredProgram(declaredProgramRequestDTO)
    },
    onSuccess: async (data, variables) => {
      await invalidateDeclaredProgramsViewQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export function useDeclaredProgramDetailedQuery (declaredProgramId: MaybeRef<string>) {
  const queryKey = computed(() => [...declaredProgramsCommonQueryKey, toValue(declaredProgramId)])

  const queryFn = computed(() => async (): Promise<DeclaredProgramDetailedDTO> => {
    return await getDeclaredProgram(toValue(declaredProgramId))
  })

  const query = useQuery<
    DeclaredProgramDetailedDTO,
    BaseApiException,
    DeclaredProgramDetailedDTO,
    readonly unknown[]
  >({
    queryKey,
    queryFn,
    enabled: computed(() => toValue(declaredProgramId).trim().length > 0),
  })

  const declaredProgramDetailed = computed(() => query.data.value)

  return {
    ...query,
    declaredProgramDetailed,
  }
}
