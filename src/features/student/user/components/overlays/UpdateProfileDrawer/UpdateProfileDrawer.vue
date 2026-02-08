<script setup lang="ts">
import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { ConfirmationModal, ImageUpload } from '@/common/components'
import { useModal } from '@/common/composables'
import { BIOGRAPHY_MAX_LENGTH } from '@/features/student/user/components/overlays/UpdateProfileDrawer/config'
import { useUpdateProfileForm } from '@/features/student/user/components/overlays/UpdateProfileDrawer/use-update-profile-form'
import { useDeletePhotoMutation } from '@/features/student/user/queries/use-student-profile/use-student-profile.query'
import { useToasterStore } from '@/store'
import {
  AvAccordion,
  AvAccordionsGroup,
  AvCancelConfirmButtons,
  AvDrawer,
  AvIconText,
  AvInput,
  MDI_ICONS
} from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

const { studentSummary, show, onClose } = defineProps<{
  studentSummary: ProfileOverviewDTO
  show: boolean
  onClose: () => void
}>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const {
  form,
  isPending,
  isModified,
  coverPictureFile,
  onCoverPictureUpdate,
  profilePictureFile,
  onProfilePictureUpdate,
  resetForm
} = useUpdateProfileForm(studentSummary, onUpdateProfileSuccess)
const FormField = markRaw(form.Field)
const { onConfirmDeleteCoverPhoto } = useDeleteCoverPhoto()
const { onConfirmDeleteProfilePhoto } = useDeleteProfilePhoto()

function onUpdateProfileSuccess () {
  addSuccessMessage(t('student.user.overlays.UpdateProfileDrawer.onUpdate.success'))
  onClose()
}

function useDeleteCoverPhoto () {
  function onDeleteCoverPhotoError (error: BaseApiException) {
    addErrorMessage({ title: t('student.user.overlays.UpdateProfileDrawer.onDelete.error'), description: error.message, type: 'error', })
  }

  const { mutate: deletePhotoMutation } = useDeletePhotoMutation({
    onError: onDeleteCoverPhotoError,
    onSuccess: onConfirmDeleteCoverPhoto
  })

  function onConfirmDeleteCoverPhoto () {
    deletePhotoMutation({ fileId: studentSummary.coverPicture.fileId! })
  }

  return { onConfirmDeleteCoverPhoto }
}

function useDeleteProfilePhoto () {
  function onDeleteProfilePhotoError (error: BaseApiException) {
    addErrorMessage({ title: t('student.user.overlays.UpdateProfileDrawer.onDelete.error'), description: error.message, type: 'error', })
  }

  const { mutate: deletePhotoMutation } = useDeletePhotoMutation({
    onError: onDeleteProfilePhotoError,
    onSuccess: onConfirmDeleteProfilePhoto
  })

  function onConfirmDeleteProfilePhoto () {
    deletePhotoMutation({ fileId: studentSummary.profilePicture.fileId! })
  }

  return { onConfirmDeleteProfilePhoto }
}

watch(() => show, (newVal) => {
  if (newVal) {
    resetForm()
  }
})
</script>

<template>
  <AvDrawer
    :show="show"
    data-testid="update-profile-drawer"
    @escape-pressed="onClose()"
  >
    <div class="av-col av-gap-xl">
      <AvIconText
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        icon-color="var(--icon)"
        :text="t('student.user.overlays.UpdateProfileDrawer.title')"
        text-color="var(--title)"
        typography-class="n6"
        data-testid="drawer-title"
      />
      <form
        id="profile-form"
        novalidate
        @submit.prevent.stop="form.handleSubmit"
      >
        <AvAccordionsGroup>
          <AvAccordion
            :title="t('student.user.overlays.UpdateProfileDrawer.identity.title')"
            :icon="MDI_ICONS.ACCOUNT_STUDENT_OUTLINE"
          >
            <div class="av-col av-gap-md">
              <FormField name="lastname">
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('student.user.overlays.UpdateProfileDrawer.identity.lastname')"
                    required
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </FormField>
              <FormField name="firstname">
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('student.user.overlays.UpdateProfileDrawer.identity.firstname')"
                    required
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </FormField>
              <FormField name="email">
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('student.user.overlays.UpdateProfileDrawer.identity.mail')"
                    type="email"
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </FormField>
              <FormField name="bio">
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('student.user.overlays.UpdateProfileDrawer.identity.biography.label')"
                    is-textarea
                    :maxlength="BIOGRAPHY_MAX_LENGTH"
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </FormField>
            </div>
          </AvAccordion>
          <AvAccordion
            :title="t('student.user.overlays.UpdateProfileDrawer.pictures.banner')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
          >
            <ImageUpload
              v-model="coverPictureFile"
              :on-delete-image="onConfirmDeleteCoverPhoto"
              :default-image-url="studentSummary.coverPicture.fileName ? studentSummary.coverPicture.url : undefined"
              :default-image-name="studentSummary.coverPicture.fileName ?? undefined"
              :image-alt="t('student.user.overlays.UpdateProfileDrawer.pictures.banner')"
              :on-update="onCoverPictureUpdate"
            />
          </AvAccordion>
          <AvAccordion
            :title="t('student.user.overlays.UpdateProfileDrawer.pictures.picture')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
          >
            <ImageUpload
              v-model="profilePictureFile"
              :on-delete-image="onConfirmDeleteProfilePhoto"
              :default-image-name="studentSummary.profilePicture.fileName ?? undefined"
              :image-alt="t('student.user.overlays.UpdateProfileDrawer.pictures.picture')"
              :on-update="onProfilePictureUpdate"
            />
          </AvAccordion>
        </AvAccordionsGroup>
      </form>
    </div>
    <template #footer>
      <div class="av-row av-justify-end">
        <AvCancelConfirmButtons
          :cancel-label="t('global.buttons.exit')"
          :confirm-label="t('global.buttons.save')"
          :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :confirm-icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          :cancel-is-loading="isPending"
          :confirm-is-loading="isPending"
          :confirm-disabled="!isModified"
          form="profile-form"
          @cancel="() => isModified ? displayModal() : onClose()"
          @confirm="form.handleSubmit"
        />
      </div>
    </template>
  </AvDrawer>
  <ConfirmationModal
    :show="showModal"
    :is-loading="isPending"
    @confirm="() => {
      hideModal()
      onClose()
    }"
    @close="hideModal"
  />
</template>
