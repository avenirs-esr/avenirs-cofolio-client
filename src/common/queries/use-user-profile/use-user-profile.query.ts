import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import {
  deleteUserPhoto,
  type EUserCategory,
  EUserPhotoType,
  getProfile,
  type ProfileOverviewDTO,
  type ProfileUpdateRequest,
  updateProfile,
  updateProfilePhoto,
  type UpdateProfilePhotoBody
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { toValue } from 'vue'

export const getUserSummaryQueryKeys = (category: EUserCategory) => ['user', category, 'summary']

export function useUserSummaryQuery (category: EUserCategory): UseQueryReturnType<ProfileOverviewDTO, BaseApiException> {
  return useQuery<ProfileOverviewDTO, BaseApiException>({
    queryKey: getUserSummaryQueryKeys(category),
    queryFn: async (): Promise<ProfileOverviewDTO> => {
      return getProfile(category)
    }
  })
}

export interface UpdateProfileVariables {
  profile: EUserCategory
  profileUpdateRequest: ProfileUpdateRequest
}

export function useUpdateProfileMutation (profile: EUserCategory, { onError, onSuccess }: MutationArgs<string> = {}) {
  const invalidateUserSummaryQuery = useInvalidateQuery(getUserSummaryQueryKeys(toValue(profile)))
  return useMutation<string, BaseApiException, UpdateProfileVariables>({
    mutationFn: async ({ profile, profileUpdateRequest }: UpdateProfileVariables): Promise<string> => {
      return await updateProfile(profile, profileUpdateRequest)
    },
    onSuccess: async (data, variables) => {
      await invalidateUserSummaryQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UpdateProfileCoverVariables {
  profile: EUserCategory
  updateProfileCoverBody: UpdateProfilePhotoBody
}

export function useUpdateProfileCoverMutation (profile: EUserCategory, { onError, onSuccess }: MutationArgs<string>) {
  const invalidateUserSummaryQuery = useInvalidateQuery(getUserSummaryQueryKeys(toValue(profile)))
  return useMutation<string, BaseApiException, UpdateProfileCoverVariables>({
    mutationFn: async ({ profile, updateProfileCoverBody }: UpdateProfileCoverVariables): Promise<string> => {
      const uploadedPhoto = await updateProfilePhoto(profile, EUserPhotoType.COVER, updateProfileCoverBody)
      return uploadedPhoto.id
    },
    onSuccess: async (data, variables) => {
      await invalidateUserSummaryQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UpdateProfilePhotoVariables {
  profile: EUserCategory
  updateProfilePhotoBody: UpdateProfilePhotoBody
}

export function useUpdateProfilePhotoMutation (profile: EUserCategory, { onError, onSuccess }: MutationArgs<string, UpdateProfilePhotoVariables>) {
  const invalidateUserSummaryQuery = useInvalidateQuery(getUserSummaryQueryKeys(toValue(profile)))
  return useMutation<string, BaseApiException, UpdateProfilePhotoVariables>({
    mutationFn: async ({ profile, updateProfilePhotoBody }: UpdateProfilePhotoVariables): Promise<string> => {
      const uploadedPhoto = await updateProfilePhoto(profile, EUserPhotoType.PROFILE, updateProfilePhotoBody)
      return uploadedPhoto.id
    },
    onSuccess: async (data, variables) => {
      await invalidateUserSummaryQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

interface DeleteUserPhotoVariables {
  fileId: string
}

export function useDeletePhotoMutation (profile: EUserCategory, { onError, onSuccess }: MutationArgs = {}) {
  const invalidateUserSummaryQuery = useInvalidateQuery(getUserSummaryQueryKeys(toValue(profile)))
  return useMutation<string, BaseApiException, DeleteUserPhotoVariables>({
    mutationFn: async ({ fileId }: DeleteUserPhotoVariables): Promise<string> => {
      return await deleteUserPhoto(fileId)
    },
    onSuccess: async (data, variables) => {
      await invalidateUserSummaryQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}
