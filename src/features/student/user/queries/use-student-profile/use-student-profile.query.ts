import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import {
  deleteUserPhoto,
  EUserCategory,
  EUserPhotoType,
  getProfile,
  type ProfileOverviewDTO,
  type ProfileUpdateRequest,
  updateProfile,
  updateProfilePhoto,
  type UpdateProfilePhotoBody
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { commonQueryKeys } from '@/features/student/global'
import { useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'

const studentSummaryQueryKeys = [...commonQueryKeys, 'summary']

export function useStudentSummaryQuery (): UseQueryReturnType<ProfileOverviewDTO, BaseApiException> {
  const queryKey = computed(() => studentSummaryQueryKeys)
  return useQuery<ProfileOverviewDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<ProfileOverviewDTO> => {
      return getProfile(EUserCategory.STUDENT)
    }
  })
}

export interface UpdateProfileVariables {
  profile: EUserCategory
  profileUpdateRequest: ProfileUpdateRequest
}

export function useUpdateProfileMutation ({ onError, onSuccess }: MutationArgs<string> = {}) {
  const invalidateStudentSummaryQuery = useInvalidateQuery(studentSummaryQueryKeys)
  return useMutation<string, BaseApiException, UpdateProfileVariables>({
    mutationFn: async ({ profile, profileUpdateRequest }: UpdateProfileVariables): Promise<string> => {
      return await updateProfile(profile, profileUpdateRequest)
    },
    onSuccess: async (data, variables) => {
      await invalidateStudentSummaryQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UpdateProfileCoverVariables {
  profile: EUserCategory
  updateProfileCoverBody: UpdateProfilePhotoBody
}

export function useUpdateProfileCoverMutation ({ onError, onSuccess }: MutationArgs<string>) {
  const invalidateStudentSummaryQuery = useInvalidateQuery(studentSummaryQueryKeys)
  return useMutation<string, BaseApiException, UpdateProfileCoverVariables>({
    mutationFn: async ({ profile, updateProfileCoverBody }: UpdateProfileCoverVariables): Promise<string> => {
      const uploadedPhoto = await updateProfilePhoto(profile, EUserPhotoType.COVER, updateProfileCoverBody)
      return uploadedPhoto.id
    },
    onSuccess: async (data, variables) => {
      await invalidateStudentSummaryQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UpdateProfilePhotoVariables {
  profile: EUserCategory
  updateProfilePhotoBody: UpdateProfilePhotoBody
}

export function useUpdateProfilePhotoMutation ({ onError, onSuccess }: MutationArgs<string, UpdateProfilePhotoVariables>) {
  const invalidateStudentSummaryQuery = useInvalidateQuery(studentSummaryQueryKeys)
  return useMutation<string, BaseApiException, UpdateProfilePhotoVariables>({
    mutationFn: async ({ profile, updateProfilePhotoBody }: UpdateProfilePhotoVariables): Promise<string> => {
      const uploadedPhoto = await updateProfilePhoto(profile, EUserPhotoType.PROFILE, updateProfilePhotoBody)
      return uploadedPhoto.id
    },
    onSuccess: async (data, variables) => {
      await invalidateStudentSummaryQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

interface DeleteUserPhotoVariables {
  fileId: string
}

export function useDeletePhotoMutation ({ onError, onSuccess }: MutationArgs = {}) {
  const invalidateStudentSummaryQuery = useInvalidateQuery(studentSummaryQueryKeys)
  return useMutation<string, BaseApiException, DeleteUserPhotoVariables>({
    mutationFn: async ({ fileId }: DeleteUserPhotoVariables): Promise<string> => {
      return await deleteUserPhoto(fileId)
    },
    onSuccess: async (data, variables) => {
      await invalidateStudentSummaryQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}
