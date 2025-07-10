import type { BaseApiException } from '@/common/exceptions'
import { getAllTrainingPaths, getSkillsView, type StudentProgressViewDTO, type TrainingPathDTO } from '@/api/avenir-esr'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const commonQueryKeys = ['user', 'student']

export function useProgramProgressViewQuery (): UseQueryReturnType<StudentProgressViewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress', 'view'])
  return useQuery<StudentProgressViewDTO[], BaseApiException>({
    queryKey,
    queryFn: async (): Promise<StudentProgressViewDTO[]> => {
      return getSkillsView()
    }
  })
}

export function useAllMyProgramProgressQuery () {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress', 'list'])
  return useQuery<TrainingPathDTO[], BaseApiException>({
    queryKey,
    queryFn: async (): Promise<TrainingPathDTO[]> => {
      return getAllTrainingPaths()
    },
    initialData: []
  })
}
