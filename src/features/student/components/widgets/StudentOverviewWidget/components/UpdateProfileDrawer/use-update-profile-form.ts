import type { BaseApiException } from '@/common/exceptions'
import type { FormKeys, UpdateProfileDrawerForm } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/types'
import { useUpdateProfile, useUpdateProfileCover, useUpdateProfilePhoto } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile'
import { useToasterStore } from '@/store'
import { isValidEmail } from '@/ui/utils'
import { cloneDeep } from 'lodash-es'
import { useI18n } from 'vue-i18n'

export function useUpdateProfileForm (initialData: UpdateProfileDrawerForm, onSuccess: () => void) {
  const { t } = useI18n()
  const { addErrorMessage } = useToasterStore()
  const { onUpdateProfile, iseUpdateProfilePending } = useUpdateProfile(onSuccess)
  const { onUpdateProfileCoverAsync, iseUpdateProfileCoverPending } = useUpdateProfileCover(onUpdateProfileCoverSuccess)
  const { onUpdateProfilePhotoAsync, iseUpdateProfilePhotoPending } = useUpdateProfilePhoto(onUpdateProfilePhotoSuccess)

  const formKeys: FormKeys[] = [
    'firstname',
    'lastname',
    'email',
    'bio',
    'coverPicture',
    'profilePicture'
  ]
  const form = reactive<UpdateProfileDrawerForm>(cloneDeep(initialData))
  const initialForm = reactive<UpdateProfileDrawerForm>(cloneDeep(initialData))
  const formErrors = reactive(
    Object.fromEntries(formKeys.map(key => [key, ''])) as Record<FormKeys, string>
  )
  const profilePictureFile = ref<File | null>(null)
  const coverPictureFile = ref<File | null>(null)

  const isPending = computed(() =>
    iseUpdateProfilePending.value || iseUpdateProfileCoverPending.value || iseUpdateProfilePhotoPending.value)

  const isModified = computed(() =>
    formKeys.some(key => form[key] !== initialForm[key]) || !!coverPictureFile.value || !!profilePictureFile.value
  )

  function onUpdateProfileCoverSuccess (data: string) {
    form.coverPicture = data
  }

  function onUpdateProfilePhotoSuccess (data: string) {
    form.profilePicture = data
  }

  function resetFormErrors () {
    formKeys.forEach((key) => {
      formErrors[key] = ''
    })
  }

  function validateForm (form: UpdateProfileDrawerForm) {
    const errors: Record<string, string> = {}

    if (!form.firstname.trim()) {
      errors.firstname = t('global.error.form.requiredFiled')
    }

    if (!form.lastname.trim()) {
      errors.lastname = t('global.error.form.requiredFiled')
    }

    if (form.email && !isValidEmail(form.email)) {
      errors.email = t('global.error.form.invalidEmail')
    }

    return errors
  }

  async function handleSubmit (event: Event) {
    event.preventDefault()

    resetFormErrors()

    const errors = validateForm(form)
    Object.assign(formErrors, errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    try {
      const [coverUrl, photoUrl] = await Promise.all([
        coverPictureFile.value ? onUpdateProfileCoverAsync({ file: coverPictureFile.value }) : Promise.resolve(null),
        profilePictureFile.value ? onUpdateProfilePhotoAsync({ file: profilePictureFile.value }) : Promise.resolve(null)
      ])

      if (coverUrl) {
        form.coverPicture = coverUrl
      }
      if (photoUrl) {
        form.profilePicture = photoUrl
      }

      onUpdateProfile(form)
    }
    catch (error) {
      addErrorMessage({
        title: t('student.widgets.overview.updateProfileDrawer.onUpdate.error'),
        description: (error as BaseApiException)?.message ?? t('global.error.generic')
      })
    }
  }

  function resetForm (data: UpdateProfileDrawerForm) {
    Object.assign(form, cloneDeep(data))
    Object.assign(initialForm, cloneDeep(data))
    coverPictureFile.value = null
    profilePictureFile.value = null
  }

  return {
    form,
    formErrors,
    coverPictureFile,
    profilePictureFile,
    isPending,
    isModified,
    handleSubmit,
    resetForm,
  }
}
