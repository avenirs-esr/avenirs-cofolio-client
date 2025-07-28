import type { ProfileUpdateRequest, UpdateProfileCoverBody, UpdateProfilePhotoBody } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { useUpdateProfileCoverMutation, useUpdateProfileMutation, useUpdateProfilePhotoMutation } from '@/features/student/queries'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

export function useUpdateProfile (onSuccess: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  function onUpdateProfileError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.widgets.overview.updateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  function onUpdateProfileSuccess () {
    onSuccess()
  }

  const updateProfileMutation = useUpdateProfileMutation({
    onError: onUpdateProfileError,
    onSuccess: onUpdateProfileSuccess
  })

  function onUpdateProfile (profileUpdateRequest: ProfileUpdateRequest) {
    updateProfileMutation.mutate({ profile: 'student', profileUpdateRequest })
  }

  return {
    onUpdateProfile,
    iseUpdateProfilePending: updateProfileMutation.isPending,
  }
}

export function useUpdateProfileCover (onSuccess: (data: string) => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  function onUpdateProfileCoverError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.widgets.overview.updateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  function onUpdateProfileCoverSuccess (data: string) {
    onSuccess(data)
  }

  const updateProfileCoverMutation = useUpdateProfileCoverMutation({
    onError: onUpdateProfileCoverError,
    onSuccess: onUpdateProfileCoverSuccess
  })

  async function onUpdateProfileCoverAsync (updateProfileCoverBody: UpdateProfileCoverBody) {
    return await updateProfileCoverMutation.mutateAsync({ profile: 'student', updateProfileCoverBody })
  }

  return {
    onUpdateProfileCoverAsync,
    iseUpdateProfileCoverPending: updateProfileCoverMutation.isPending,
  }
}

export function useUpdateProfilePhoto (onSuccess: (data: string) => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()

  function onUpdateProfilePhotoError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.widgets.overview.updateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  function onUpdateProfilePhotoSuccess (data: string) {
    onSuccess(data)
  }

  const updateProfilePhotoMutation = useUpdateProfilePhotoMutation({
    onError: onUpdateProfilePhotoError,
    onSuccess: onUpdateProfilePhotoSuccess
  })

  async function onUpdateProfilePhotoAsync (updateProfilePhotoBody: UpdateProfilePhotoBody) {
    return await updateProfilePhotoMutation.mutateAsync({ profile: 'student', updateProfilePhotoBody })
  }

  return {
    onUpdateProfilePhotoAsync,
    iseUpdateProfilePhotoPending: updateProfilePhotoMutation.isPending,
  }
}
