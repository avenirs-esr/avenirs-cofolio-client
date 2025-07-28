import type { BaseApiException } from '@/common/exceptions'
import type { UpdateProfileDrawerForm } from './types'
import { useUpdateProfile, useUpdateProfileCover, useUpdateProfilePhoto } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile'
import { useToasterStore } from '@/store'
import { isValidEmail } from '@/ui/utils'
import { useForm, useStore } from '@tanstack/vue-form'
import { useI18n } from 'vue-i18n'

export function useUpdateProfileForm (initialData: UpdateProfileDrawerForm, onSuccess: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const { onUpdateProfile, iseUpdateProfilePending } = useUpdateProfile(onSuccess)
  const { onUpdateProfileCoverAsync, iseUpdateProfileCoverPending } = useUpdateProfileCover(onUpdateProfileCoverSuccess)
  const { onUpdateProfilePhotoAsync, iseUpdateProfilePhotoPending } = useUpdateProfilePhoto(onUpdateProfilePhotoSuccess)

  const coverPictureFile = ref<File | null>(null)
  const profilePictureFile = ref<File | null>(null)

  const form = useForm({
    defaultValues: { ...initialData },
    validators: {
      onSubmit ({ value }) {
        return {
          fields: {
            lastname: !value.lastname.trim() ? t('global.error.form.requiredFiled') : undefined,
            firstname: !value.firstname.trim() ? t('global.error.form.requiredFiled') : undefined,
            email: value.email && !isValidEmail(value.email) ? t('global.error.form.invalidEmail') : undefined,
          }
        }
      }
    },
    onSubmit: async ({ value }) => {
      try {
        const { email, firstname, lastname, bio } = value

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

        onUpdateProfile({ email, firstname, lastname, bio })
      }
      catch (error) {
        addErrorMessage({
          title: t('student.widgets.overview.updateProfileDrawer.onUpdate.error'),
          description: (error as BaseApiException)?.message ?? t('global.error.generic')
        })
      }
    },
  })

  function onUpdateProfileCoverSuccess (url: string) {
    form.setFieldValue('coverPicture', url)
  }

  function onUpdateProfilePhotoSuccess (url: string) {
    form.setFieldValue('profilePicture', url)
  }

  function onCoverPictureUpdate (file: File | null) {
    coverPictureFile.value = file
  }

  function onProfilePictureUpdate (file: File | null) {
    profilePictureFile.value = file
  }

  const isPending = computed(() =>
    iseUpdateProfilePending.value
    || iseUpdateProfileCoverPending.value
    || iseUpdateProfilePhotoPending.value
    || form.state.isSubmitting
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
    onCoverPictureUpdate,
    onProfilePictureUpdate,
    onUpdateProfileCoverSuccess,
    onUpdateProfilePhotoSuccess
  }
}
