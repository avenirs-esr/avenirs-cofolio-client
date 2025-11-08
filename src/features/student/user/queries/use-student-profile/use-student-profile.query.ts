import type { BaseApiException } from '@/common/exceptions'
import type { CommonMutationArgs, StudentHeaderSummaryDTO } from '@/types'
import { mockedHeaderOverview } from '@/__mocks__/fixtures/student'
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
const headerSummaryQueryKeys = [...commonQueryKeys, 'header']

export function useStudentSummaryQuery (): UseQueryReturnType<ProfileOverviewDTO, BaseApiException> {
  const queryKey = computed(() => studentSummaryQueryKeys)
  return useQuery<ProfileOverviewDTO, BaseApiException>({
    queryKey,
    queryFn: async (): Promise<ProfileOverviewDTO> => {
      return getProfile(EUserCategory.STUDENT)
    }
  })
}

export function useStudentHeaderSummaryQuery (): UseQueryReturnType<StudentHeaderSummaryDTO, BaseApiException> {
  const queryKey = computed(() => headerSummaryQueryKeys)
  return useQuery<StudentHeaderSummaryDTO, BaseApiException>({
    queryKey,
    // TODO: call /me/header/overview when the endpoint and client are ready
    queryFn: async (): Promise<StudentHeaderSummaryDTO> => {
      return mockedHeaderOverview
    }
  })
}

export interface UpdateProfileVariables {
  profile: EUserCategory
  profileUpdateRequest: ProfileUpdateRequest
}

export function useUpdateProfileMutation ({ onError, onSuccess }: CommonMutationArgs = {}) {
  const invalidateStudentSummaryQuery = useInvalidateQuery(studentSummaryQueryKeys)
  const invalidateHeaderSummaryQuery = useInvalidateQuery(headerSummaryQueryKeys)
  return useMutation<string, BaseApiException, UpdateProfileVariables>({
    mutationFn: async ({ profile, profileUpdateRequest }: UpdateProfileVariables): Promise<string> => {
      return await updateProfile(profile, profileUpdateRequest)
    },
    onSuccess: async (data) => {
      await invalidateStudentSummaryQuery()
      await invalidateHeaderSummaryQuery()
      onSuccess?.(data)
    },
    onError
  })
}

export interface UpdateProfileCoverVariables {
  profile: EUserCategory
  updateProfileCoverBody: UpdateProfilePhotoBody
}

export function useUpdateProfileCoverMutation ({ onError, onSuccess }: CommonMutationArgs = {}) {
  return useMutation<string, BaseApiException, UpdateProfileCoverVariables>({
    mutationFn: async ({ profile, updateProfileCoverBody }: UpdateProfileCoverVariables): Promise<string> => {
      const uploadedPhoto = await updateProfilePhoto(profile, EUserPhotoType.COVER, updateProfileCoverBody)
      return uploadedPhoto.id
    },
    onSuccess,
    onError
  })
}

export interface UpdateProfilePhotoVariables {
  profile: EUserCategory
  updateProfilePhotoBody: UpdateProfilePhotoBody
}

export function useUpdateProfilePhotoMutation ({ onError, onSuccess }: CommonMutationArgs = {}) {
  return useMutation<string, BaseApiException, UpdateProfilePhotoVariables>({
    mutationFn: async ({ profile, updateProfilePhotoBody }: UpdateProfilePhotoVariables): Promise<string> => {
      const uploadedPhoto = await updateProfilePhoto(profile, EUserPhotoType.PROFILE, updateProfilePhotoBody)
      return uploadedPhoto.id
    },
    onSuccess,
    onError
  })
}

interface DeleteUserPhotoVariables {
  fileId: string
}

export interface UseDeletePhotoMutationArgs {
  onSuccess?: () => void
  onError?: (error: BaseApiException) => void
}

export function useDeletePhotoMutation ({ onError, onSuccess }: UseDeletePhotoMutationArgs = {}) {
  const invalidateStudentSummaryQuery = useInvalidateQuery(studentSummaryQueryKeys)
  return useMutation<string, BaseApiException, DeleteUserPhotoVariables>({
    mutationFn: async ({ fileId }: DeleteUserPhotoVariables): Promise<string> => {
      return await deleteUserPhoto(fileId)
    },
    onSuccess: async () => {
      await invalidateStudentSummaryQuery()
      onSuccess?.()
    },
    onError
  })
}
