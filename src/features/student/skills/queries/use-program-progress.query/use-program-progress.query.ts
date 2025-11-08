import type { BaseApiException } from '@/common/exceptions'
import {
  getAllStudentProgress,
  getStudentProgressView,
  type GetStudentProgressViewParams,
  type StudentProgressViewDTO,
  type TrainingPathDTO
} from '@/api/avenir-esr'
import { commonQueryKeys } from '@/features/student/global'
import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, toValue } from 'vue'

const programProgressQueryKeys = [...commonQueryKeys, 'programProgress']

export function useProgramProgressViewQuery (params?: MaybeRef<GetStudentProgressViewParams>): UseQueryReturnType<StudentProgressViewDTO[], BaseApiException> {
  const queryKey = computed(() => [...programProgressQueryKeys, 'view', {
    sort: toValue(params)?.sort
  }])
  return useQuery<StudentProgressViewDTO[], BaseApiException>({
    queryKey,
    queryFn: async (): Promise<StudentProgressViewDTO[]> => {
      return getStudentProgressView(toValue(params))
    }
  })
}

export function useAllMyProgramProgressQuery () {
  const queryKey = computed(() => [...programProgressQueryKeys, 'list'])
  return useQuery<TrainingPathDTO[], BaseApiException>({
    queryKey,
    queryFn: async (): Promise<TrainingPathDTO[]> => {
      const response = await getAllStudentProgress()
      return response.map(studentProgress => studentProgress.trainingPath)
    },
    initialData: []
  })
}
