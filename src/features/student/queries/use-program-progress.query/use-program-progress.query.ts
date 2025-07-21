import type { BaseApiException } from '@/common/exceptions'
import {
  getAllTrainingPaths,
  getSkillsView,
  type GetSkillsViewParams,
  type StudentProgressViewDTO,
  type TrainingPathDTO
} from '@/api/avenir-esr'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'

const commonQueryKeys = ['user', 'student']

export function useProgramProgressViewQuery (params?: MaybeRef<GetSkillsViewParams>): UseQueryReturnType<StudentProgressViewDTO[], BaseApiException> {
  const queryKey = computed(() => [...commonQueryKeys, 'programProgress', 'view', {
    sort: toValue(params)?.sort
  }])
  return useQuery<StudentProgressViewDTO[], BaseApiException>({
    queryKey,
    queryFn: async (): Promise<StudentProgressViewDTO[]> => {
      return getSkillsView(toValue(params))
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
