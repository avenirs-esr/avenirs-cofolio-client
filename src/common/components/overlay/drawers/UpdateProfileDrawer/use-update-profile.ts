import type { BaseApiException } from '@/common/exceptions'
import {
  type EUserCategory,
  EUserPhotoType,
  invalidateGetProfile,
  type ProfileUpdateRequest,
  type UpdateProfilePhotoBody,
  type UserPhotoUploadDTO,
  useUpdateProfile as useUpdateProfileFromApi,
  useUpdateProfilePhoto as useUpdateProfilePhotoFromApi,
} from '@/api/avenir-esr'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useUpdateProfile (profile: EUserCategory, onProfileUpdated: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  function onUpdateProfileError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  const { mutate: updateProfileMutation, isPending: isUpdateProfilePending } = useUpdateProfileFromApi()

  function updateProfile (userCategory: EUserCategory, profileUpdateRequest: ProfileUpdateRequest) {
    updateProfileMutation({ userCategory, data: profileUpdateRequest }, {
      onError: onUpdateProfileError,
      onSuccess: async (_data, variables) => {
        await withTaskLoading(() => invalidateGetProfile(queryClient, variables.userCategory))
        onProfileUpdated()
      }
    })
  }

  function onUpdateProfile (profileUpdateRequest: ProfileUpdateRequest) {
    updateProfile(profile, profileUpdateRequest)
  }

  return {
    onUpdateProfile,
    isUpdateProfilePending: isUpdateProfilePending || isLoading.value,
  }
}

export function useUpdateProfileCover (profile: EUserCategory, onSuccess: (data: string) => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  function onUpdateProfileCoverError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  function onUpdateProfileCoverSuccess (data: UserPhotoUploadDTO) {
    onSuccess(data.id)
  }

  const { mutateAsync: updateProfilePhotoMutation, isPending: isUpdateProfileCoverPending } = useUpdateProfilePhotoFromApi()

  async function onUpdateProfileCoverAsync (userCategory: EUserCategory, updateProfilePhotoBody: UpdateProfilePhotoBody) {
    return await updateProfilePhotoMutation({ userCategory, photoType: EUserPhotoType.COVER, data: updateProfilePhotoBody }, {
      onError: onUpdateProfileCoverError,
      onSuccess: async (data, variables) => {
        await withTaskLoading(() => invalidateGetProfile(queryClient, variables.userCategory))
        onUpdateProfileCoverSuccess(data)
      }
    })
  }

  return {
    onUpdateProfileCoverAsync,
    isUpdateProfileCoverPending: isUpdateProfileCoverPending || isLoading.value,
  }
}

export function useUpdateProfilePhoto (profile: EUserCategory, onProfilePhotoUpdated: (data: string) => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  function onUpdateProfilePhotoError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  const { mutateAsync: updateProfilePhotoMutation, isPending: isUpdateProfilePhotoPending } = useUpdateProfilePhotoFromApi()

  async function onUpdateProfilePhotoAsync (userCategory: EUserCategory, updateProfilePhotoBody: UpdateProfilePhotoBody) {
    return await updateProfilePhotoMutation({ userCategory, photoType: EUserPhotoType.PROFILE, data: updateProfilePhotoBody }, {
      onError: onUpdateProfilePhotoError,
      onSuccess: async (data, variables) => {
        await withTaskLoading(() => invalidateGetProfile(queryClient, variables.userCategory))
        onProfilePhotoUpdated(data.id)
      }
    })
  }

  return {
    onUpdateProfilePhotoAsync,
    isUpdateProfilePhotoPending: isUpdateProfilePhotoPending || isLoading.value,
  }
}
