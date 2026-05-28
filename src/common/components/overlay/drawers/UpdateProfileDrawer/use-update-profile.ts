import type { BaseApiException } from '@/common/exceptions'
import {
  EFileCategory,
  EUserCategory,
  type FileDTO,
  invalidateGetProfile,
  type ProfileUpdateRequest,
  type UploadFileBody,
  useUpdateProfile as useUpdateProfileFromApi,
  useUploadFile as useUpdateProfilePhotoFromApi,
} from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useToasterStore } from '@/store'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export function useUpdateProfile (profile: EUserCategory, onProfileUpdated: () => void) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  function onUpdateProfileError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: getErrorMessage(error)
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

function getUserCategoryFromFileCategory (fileCategory: EFileCategory) {
  if ([EFileCategory.STUDENT_PROFILE_PICTURE, EFileCategory.STUDENT_COVER_PICTURE].includes(fileCategory)) {
    return EUserCategory.STUDENT
  }
  if ([EFileCategory.STAFF_PROFILE_PICTURE, EFileCategory.STAFF_COVER_PICTURE].includes(fileCategory)) {
    return EUserCategory.STAFF
  }
  throw new Error(`Unexcepted file category: ${fileCategory}`)
}

export function useUpdateProfileCover (profile: EUserCategory, onSuccess: (data: string) => void) {
  const { t } = useI18n()
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  function onUpdateProfileCoverError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: getErrorMessage(error)
    })
  }

  function onUpdateProfileCoverSuccess (data: FileDTO) {
    onSuccess(data.id)
  }

  const { mutateAsync: updateProfilePhotoMutation, isPending: isUpdateProfileCoverPending } = useUpdateProfilePhotoFromApi()

  async function onUpdateProfileCoverAsync (fileCategory: EFileCategory, elementId: string, updateProfilePhotoBody: UploadFileBody) {
    return await updateProfilePhotoMutation({ fileCategory, elementId, data: updateProfilePhotoBody }, {
      onError: onUpdateProfileCoverError,
      onSuccess: async (data, variables) => {
        await withTaskLoading(() => invalidateGetProfile(queryClient, getUserCategoryFromFileCategory(variables.fileCategory)))
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
  const { getErrorMessage } = useApiErrors()
  const { addErrorMessage } = useToasterStore()
  const queryClient = useQueryClient()
  const { isLoading, withTaskLoading } = useTaskLoading()

  function onUpdateProfilePhotoError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: getErrorMessage(error)
    })
  }

  const { mutateAsync: updateProfilePhotoMutation, isPending: isUpdateProfilePhotoPending } = useUpdateProfilePhotoFromApi()

  async function onUpdateProfilePhotoAsync (fileCategory: EFileCategory, elementId: string, updateProfilePhotoBody: UploadFileBody) {
    return await updateProfilePhotoMutation({ fileCategory, elementId, data: updateProfilePhotoBody }, {
      onError: onUpdateProfilePhotoError,
      onSuccess: async (data, variables) => {
        await withTaskLoading(() => invalidateGetProfile(queryClient, getUserCategoryFromFileCategory(variables.fileCategory)))
        onProfilePhotoUpdated(data.id)
      }
    })
  }

  return {
    onUpdateProfilePhotoAsync,
    isUpdateProfilePhotoPending: isUpdateProfilePhotoPending || isLoading.value,
  }
}
