<script setup lang="ts">
import type { ProfileOverviewDTO, ProfileUpdateRequest, UpdateProfileCoverBody, UpdateProfilePhotoBody } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { ImageUpload } from '@/common/components'
import { useModal } from '@/common/composables'
import UpdateExitConfirmationModal from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateExitConfirmationModal/UpdateExitConfirmationModal.vue'
import { useUpdateProfileCoverMutation, useUpdateProfileMutation, useUpdateProfilePhotoMutation } from '@/features/student/queries'
import { useToasterStore } from '@/store'
import {
  AvAccordion,
  AvAccordionsGroup,
  AvButton,
  AvDrawer,
  AvIconText,
  AvInput,
  MDI_ICONS
} from '@/ui'
import { isValidEmail } from '@/ui/utils'
import { useI18n } from 'vue-i18n'

export interface UpdateProfileDrawerForm {
  email: string
  firstname: string
  lastname: string
  bio: string
  coverPicture: string
  profilePicture: string
}

const { studentSummary, show, onClose } = defineProps<{
  studentSummary: ProfileOverviewDTO
  show: boolean
  onClose: () => void
}>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const { onUpdateProfile, iseUpdateProfilePending } = useUpdateProfile()
const { onUpdateProfileCoverAsync, iseUpdateProfileCoverPending } = useUpdateProfileCover()
const { onUpdateProfilePhotoAsync, iseUpdateProfilePhotoPending } = useUpdateProfilePhoto()

const isPending = computed(() =>
  iseUpdateProfilePending.value || iseUpdateProfileCoverPending.value || iseUpdateProfilePhotoPending.value)

const form = reactive<UpdateProfileDrawerForm>({
  firstname: studentSummary.firstname,
  lastname: studentSummary.lastname,
  email: 'test@test.com',
  bio: studentSummary.bio,
  coverPicture: studentSummary.coverPicture,
  profilePicture: studentSummary.profilePicture,
})

const initialForm = reactive<UpdateProfileDrawerForm>({ ...form })

type FormKeys = keyof UpdateProfileDrawerForm
const formKeys: FormKeys[] = [
  'firstname',
  'lastname',
  'email',
  'bio',
  'coverPicture',
  'profilePicture'
]

const profilePictureFile = ref<File | null>(null)
const coverPictureFile = ref<File | null>(null)

const isModified = computed(() =>
  formKeys.some(key => form[key] !== initialForm[key]) || !!coverPictureFile.value || !!profilePictureFile.value
)
const formErrors = reactive(
  Object.fromEntries(formKeys.map(key => [key, ''])) as Record<FormKeys, string>
)

function useUpdateProfile () {
  function onUpdateProfileError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.widgets.overview.updateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  function onUpdateProfileSuccess () {
    addSuccessMessage(t('student.widgets.overview.updateProfileDrawer.onUpdate.success'))
    onClose()
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

function useUpdateProfileCover () {
  function onUpdateProfileCoverError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.widgets.overview.updateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  function onUpdateProfileCoverSuccess (data: string) {
    form.coverPicture = data
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

function useUpdateProfilePhoto () {
  function onUpdateProfilePhotoError (error: BaseApiException) {
    addErrorMessage({
      title: t('student.widgets.overview.updateProfileDrawer.onUpdate.error'),
      description: error.message
    })
  }

  function onUpdateProfilePhotoSuccess (data: string) {
    form.profilePicture = data
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

function resetFormErrors () {
  formKeys.forEach((key) => {
    formErrors[key] = ''
  })
}

function validateForm () {
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

  const errors = validateForm()
  Object.assign(formErrors, errors)
  if (Object.keys(errors).length > 0) {
    return
  }

  try {
    if (coverPictureFile.value) {
      const url = await onUpdateProfileCoverAsync({ file: coverPictureFile.value })
      form.coverPicture = url
    }

    if (profilePictureFile.value) {
      const url = await onUpdateProfilePhotoAsync({ file: profilePictureFile.value })
      form.profilePicture = url
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

function onCoverPictureUpdate (file: File | null) {
  coverPictureFile.value = file
}

function onProfilePictureUpdate (file: File | null) {
  profilePictureFile.value = file
}

watch(() => show, (newVal) => {
  if (newVal) {
    Object.assign(form, {
      firstname: studentSummary.firstname,
      lastname: studentSummary.lastname,
      bio: studentSummary.bio,
      email: 'test@test.com',
      coverPicture: studentSummary.coverPicture,
      profilePicture: studentSummary.profilePicture,
    })
    coverPictureFile.value = null
    profilePictureFile.value = null
  }
})
</script>

<template>
  <AvDrawer :show="show">
    <div class="main-container">
      <AvIconText
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        icon-color="var(--icon)"
        :text="t('student.widgets.overview.updateProfileDrawer.title')"
        text-color="var(--title)"
        typography-class="n6"
      />
      <form
        id="profile-form"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <AvAccordionsGroup>
          <AvAccordion
            :title="t('student.widgets.overview.updateProfileDrawer.identity.title')"
            :icon="MDI_ICONS.ACCOUNT_STUDENT_OUTLINE"
          >
            <div class="form">
              <AvInput
                v-model="form.lastname"
                :label="t('student.widgets.overview.updateProfileDrawer.identity.lastname')"
                required
                :error-message="formErrors.lastname"
              />
              <AvInput
                v-model="form.firstname"
                :label="t('student.widgets.overview.updateProfileDrawer.identity.firstname')"
                required
                :error-message="formErrors.firstname"
              />
              <AvInput
                v-model="form.email"
                type="email"
                :label="t('student.widgets.overview.updateProfileDrawer.identity.mail')"
                autocomplete="email"
                :error-message="formErrors.email"
              />
              <AvInput
                v-model="form.bio"
                :label="t('student.widgets.overview.updateProfileDrawer.identity.description')"
                is-textarea
                :maxlength="350"
                :error-message="formErrors.bio"
              />
            </div>
          </AvAccordion>
          <AvAccordion
            :title="t('student.widgets.overview.updateProfileDrawer.pictures.banner')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
          >
            <ImageUpload
              :default-image="form.coverPicture"
              :image-alt="t('student.widgets.overview.updateProfileDrawer.pictures.banner')"
              :on-update="onCoverPictureUpdate"
            />
          </AvAccordion>
          <AvAccordion
            :title="t('student.widgets.overview.updateProfileDrawer.pictures.picture')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
          >
            <ImageUpload
              :default-image="form.profilePicture"
              :image-alt="t('student.widgets.overview.updateProfileDrawer.pictures.picture')"
              :on-update="onProfilePictureUpdate"
            />
          </AvAccordion>
        </AvAccordionsGroup>
      </form>
    </div>
    <template #footer>
      <div class="footer">
        <AvButton
          variant="DEFAULT"
          theme="PRIMARY"
          size="sm"
          :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :label="t('global.buttons.exit')"
          :is-loading="isPending"
          :on-click="isModified ? displayModal : onClose"
        />
        <AvButton
          variant="FLAT"
          theme="PRIMARY"
          size="sm"
          :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          :label="t('global.buttons.save')"
          :disabled="!isModified"
          :is-loading="isPending"
          type="submit"
          form="profile-form"
        />
      </div>
    </template>
  </AvDrawer>
  <UpdateExitConfirmationModal
    :show-modal="showModal"
    :on-confirm="() => {
      hideModal()
      onClose()
    }"
    :on-cancel="hideModal"
    :is-loading="isPending"
  />
</template>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--spacing-xl);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: var(--spacing-sm);
}

.caption-light, .caption-bold {
  color: var(--text2);
}

.b2-bold {
  color: var(--text1);
}

img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
