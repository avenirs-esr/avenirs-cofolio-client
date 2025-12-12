import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import { type AddDeclaredProgramDTO, createDeclaredProgram, type DeclaredProgramViewDTO } from '@/api/avenir-esr'
import { commonQueryKeys } from '@/features/student/global'
import { useMutation } from '@tanstack/vue-query'

// eslint-disable-next-line unused-imports/no-unused-vars
const declaredProgramsCommonQueryKey = [...commonQueryKeys, 'declared-programs']

export function useCreateDeclaredProgramMutation ({ onError, onSuccess }: MutationArgs = {}) {
  return useMutation<DeclaredProgramViewDTO, BaseApiException, AddDeclaredProgramDTO>({
    mutationFn: async (addDeclaredProgramDTO: AddDeclaredProgramDTO): Promise<DeclaredProgramViewDTO> => {
      return await createDeclaredProgram(addDeclaredProgramDTO)
    },
    onSuccess: async (data, variables) => {
      // TODO: invalidate view queries when they are implemented
      onSuccess?.(data, variables)
    },
    onError
  })
}
