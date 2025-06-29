import type { ProgramProgressDTO, ProgramProgressViewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { mockedPrograms } from '@/features/student/queries/fixtures'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useProgramProgressViewQuery (): UseQueryReturnType<ProgramProgressViewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress', 'view'])
  return useQuery<ProgramProgressViewDTO[], BaseApiException>({
    queryKey,
    // TODO: call /program-progress/view when the endpoint and client are ready
    queryFn: async (): Promise<ProgramProgressViewDTO[]> => {
      /*
      // TODO: uncomment when the endpoint and client are ready
      return getSkillsView()
      */

      return mockedPrograms
    }
  })
}

export function useAllMyProgramProgressQuery (): UseQueryReturnType<ProgramProgressDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress', 'list'])
  return useQuery<ProgramProgressDTO[], BaseApiException>({
    queryKey,
    queryFn: async (): Promise<ProgramProgressDTO[]> => {
      /*
      // TODO: uncomment when the endpoint and client are ready
      return getAllProgramProgress()
      */
      return mockedPrograms.slice(0, 2).map(program => ({
        id: program.id,
        name: program.name,
      }))
    }
  })
}
