import type { EUserCategory, ProfileUpdateRequest, UpdateProfilePhotoBody } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import {
  useUpdateProfileCoverMutation,
  useUpdateProfileMutation,
  useUpdateProfilePhotoMutation
} from '@/common/queries/use-user-profile/use-user-profile.query'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export function useUpdateProfile (profile: EUserCategory, onProfileUpdated: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  function onUpdateProfileError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  const updateProfileMutation = useUpdateProfileMutation(profile, {
    onError: onUpdateProfileError,
    onSuccess: onProfileUpdated
  })

  function onUpdateProfile (profileUpdateRequest: ProfileUpdateRequest) {
    updateProfileMutation.mutate({ profile, profileUpdateRequest })
  }

  return {
    onUpdateProfile,
    isUpdateProfilePending: updateProfileMutation.isPending,
  }
}

export function useUpdateProfileCover (profile: EUserCategory, onSuccess: (data: string) => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  function onUpdateProfileCoverError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  function onUpdateProfileCoverSuccess (data: string) {
    onSuccess(data)
  }

  const updateProfileCoverMutation = useUpdateProfileCoverMutation(profile, {
    onError: onUpdateProfileCoverError,
    onSuccess: onUpdateProfileCoverSuccess
  })

  async function onUpdateProfileCoverAsync (updateProfileCoverBody: UpdateProfilePhotoBody) {
    return await updateProfileCoverMutation.mutateAsync({ profile, updateProfileCoverBody })
  }

  return {
    onUpdateProfileCoverAsync,
    isUpdateProfileCoverPending: updateProfileCoverMutation.isPending,
  }
}

export function useUpdateProfilePhoto (profile: EUserCategory, onProfilePhotoUpdated: (data: string) => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  function onUpdateProfilePhotoError (error: BaseApiException) {
    addErrorMessage({
      title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  const updateProfilePhotoMutation = useUpdateProfilePhotoMutation(profile, {
    onError: onUpdateProfilePhotoError,
    onSuccess: onProfilePhotoUpdated
  })

  async function onUpdateProfilePhotoAsync (updateProfilePhotoBody: UpdateProfilePhotoBody) {
    return await updateProfilePhotoMutation.mutateAsync({ profile, updateProfilePhotoBody })
  }

  return {
    onUpdateProfilePhotoAsync,
    isUpdateProfilePhotoPending: updateProfilePhotoMutation.isPending,
  }
}
