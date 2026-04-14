import type { BaseApiException } from '@/common/exceptions'
import { EUserCategory, type ProfileOverviewDTO } from '@/api/avenir-esr'
import { BIOGRAPHY_MAX_LENGTH } from '@/common/components/overlay/drawers/UpdateProfileDrawer/config'
import { useUpdateProfile, useUpdateProfileCover, useUpdateProfilePhoto } from '@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile'
import { useToasterStore } from '@/store'
import { isValidEmail } from '@avenirs-esr/avenirs-dsav'
import { useForm, useStore } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

interface UseUpdateProfileFormData extends Omit<ProfileOverviewDTO, 'bio'> {
  bio?: string
}

export function useUpdateProfileForm (initialData: UseUpdateProfileFormData, profile: EUserCategory, onSuccess: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const { onUpdateProfile, isUpdateProfilePending } = useUpdateProfile(profile, onSuccess)
  const { onUpdateProfileCoverAsync, isUpdateProfileCoverPending } = useUpdateProfileCover(profile, onUpdateProfileCoverSuccess)
  const { onUpdateProfilePhotoAsync, isUpdateProfilePhotoPending } = useUpdateProfilePhoto(profile, onUpdateProfilePhotoSuccess)

  const coverPictureFile = ref<File | null>(null)
  const profilePictureFile = ref<File | null>(null)

  const validateBiography = (value?: string) => {
    if (!value) {
      return
    }
    return value.trim().length > BIOGRAPHY_MAX_LENGTH ? t('global.overlay.drawers.UpdateProfileDrawer.identity.biography.errors.tooLong', { maxLength: BIOGRAPHY_MAX_LENGTH }) : undefined
  }
  const form = useForm({
    defaultValues: { ...initialData },
    validators: {
      onSubmit ({ value }) {
        return {
          fields: {
            email: value.email && !isValidEmail(value.email) ? t('global.error.form.invalidEmail') : undefined,
            bio: validateBiography(value.bio)
          }
        }
      }
    },
    onSubmit: async ({ value }) => {
      try {
        const { email, bio } = value

        const [coverResult, photoResult] = await Promise.allSettled([
          coverPictureFile.value ? onUpdateProfileCoverAsync({ file: coverPictureFile.value }) : Promise.resolve(),
          profilePictureFile.value ? onUpdateProfilePhotoAsync({ file: profilePictureFile.value }) : Promise.resolve()
        ])

        if (coverResult.status === 'rejected') {
          throw coverResult.reason
        }

        if (photoResult.status === 'rejected') {
          throw photoResult.reason
        }

        if (profile === EUserCategory.STUDENT) {
          onUpdateProfile({ email, bio })
        }
        else {
          onSuccess()
        }
      }
      catch (error) {
        addErrorMessage({
          title: t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.error'),
          description: (error as BaseApiException)?.message ?? t('global.error.generic')
        })
      }
    },
  })

  function onUpdateProfileCoverSuccess (url: string) {
    form.setFieldValue('coverPicture.url', url)
  }

  function onUpdateProfilePhotoSuccess (url: string) {
    form.setFieldValue('profilePicture.url', url)
  }

  function onCoverPictureUpdate (file: File | null) {
    coverPictureFile.value = file
  }

  function onProfilePictureUpdate (file: File | null) {
    profilePictureFile.value = file
  }

  const isPending = computed(() =>
    isUpdateProfilePending.value
    || isUpdateProfileCoverPending.value
    || isUpdateProfilePhotoPending.value
  )

  const isDefaultValue = useStore(form.store, state => state.isDefaultValue)

  const isModified = computed(() =>
    !isDefaultValue.value || !!coverPictureFile.value || !!profilePictureFile.value
  )

  function resetForm () {
    form.reset(initialData)
    coverPictureFile.value = null
    profilePictureFile.value = null
  }

  return {
    form,
    isPending,
    isModified,
    resetForm,
    coverPictureFile,
    onCoverPictureUpdate,
    profilePictureFile,
    onProfilePictureUpdate,
    onUpdateProfileCoverSuccess,
    onUpdateProfilePhotoSuccess
  }
}
