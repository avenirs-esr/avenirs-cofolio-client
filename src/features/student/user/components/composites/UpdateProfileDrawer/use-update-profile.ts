import type { BaseApiException } from '@/common/exceptions'
import { EUserCategory, type ProfileUpdateRequest, type UpdateProfilePhotoBody } from '@/api/avenir-esr'
import { useUpdateProfileCoverMutation, useUpdateProfileMutation, useUpdateProfilePhotoMutation } from '@/features/student/user/queries/use-student-profile/use-student-profile.query'
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
    updateProfileMutation.mutate({ profile: EUserCategory.STUDENT, profileUpdateRequest })
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

  async function onUpdateProfileCoverAsync (updateProfileCoverBody: UpdateProfilePhotoBody) {
    return await updateProfileCoverMutation.mutateAsync({ profile: EUserCategory.STUDENT, updateProfileCoverBody })
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
    return await updateProfilePhotoMutation.mutateAsync({ profile: EUserCategory.STUDENT, updateProfilePhotoBody })
  }

  return {
    onUpdateProfilePhotoAsync,
    iseUpdateProfilePhotoPending: updateProfilePhotoMutation.isPending,
  }
}
