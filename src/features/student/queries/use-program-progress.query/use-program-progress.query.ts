import type { BaseApiException } from '@/common/exceptions'
import { getAllProgramProgress, getSkillsView, type ProgramProgressDTO, type ProgramProgressViewDTO } from '@/api/avenir-esr'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useProgramProgressViewQuery (): UseQueryReturnType<ProgramProgressViewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress', 'view'])
  return useQuery<ProgramProgressViewDTO[], BaseApiException>({
    queryKey,
    queryFn: async (): Promise<ProgramProgressViewDTO[]> => {
      return getSkillsView()
    }
  })
}

export function useAllMyProgramProgressQuery () {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress', 'list'])
  return useQuery<ProgramProgressDTO[], BaseApiException>({
    queryKey,
    queryFn: async (): Promise<ProgramProgressDTO[]> => {
      return getAllProgramProgress()
    },
    initialData: []
  })
}
