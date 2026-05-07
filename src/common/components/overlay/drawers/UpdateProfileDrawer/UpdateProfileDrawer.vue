<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import { EUserCategory, type FileDTO, invalidateGetProfile, useDeleteUserPhoto } from '@/api/avenir-esr'
import { ConfirmationModal, ImageUpload } from '@/common/components'
import { BIOGRAPHY_MAX_LENGTH } from '@/common/components/overlay/drawers/UpdateProfileDrawer/config'
import { useUpdateProfileForm } from '@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile-form'
import { useModal } from '@/common/composables'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
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
import { useQueryClient } from '@tanstack/vue-query'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface UpdateProfileDrawerProps {
  firstname: string
  lastname: string
  bio?: string
  email: string
  profilePicture: FileDTO
  coverPicture: FileDTO
  show: boolean
  onClose: () => void
}

const {
  firstname,
  lastname,
  bio,
  email,
  profilePicture,
  coverPicture,
  show,
  onClose
} = defineProps<UpdateProfileDrawerProps>()

const { t } = useI18n()
const route = useRoute()
const { showModal, displayModal, hideModal } = useModal()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const userCategory = computed<EUserCategory>(() => route.path.startsWith('/student') ? EUserCategory.STUDENT : EUserCategory.STAFF)

const {
  form,
  isPending,
  isModified,
  isFormValid,
  hasIdentityErrors,
  hasCoverPictureErrors,
  hasProfilePictureErrors,
  coverPictureFile,
  onCoverPictureUpdate,
  profilePictureFile,
  onProfilePictureUpdate,
  resetForm
} = useUpdateProfileForm({ firstname, lastname, bio, email, profilePicture, coverPicture }, userCategory.value, onUpdateProfileSuccess)
const FormField = markRaw(form.Field)

function onUpdateProfileSuccess () {
  addSuccessMessage(t('global.overlay.drawers.UpdateProfileDrawer.onUpdate.success'))
  onClose()
}

const {
  canLeave,
  confirm,
  cancel
} = useUnsavedChangesGuard({
  isDirty: isModified,
  openModal: displayModal,
  closeModal: hideModal
})

const { mutate: deleteCoverPictureMutation } = useDeleteUserPhoto()

function deleteCoverPicture ({ fileId }: { fileId: string }) {
  deleteCoverPictureMutation({ fileId }, {
    onError: (error: BaseApiException) => addErrorMessage({ title: t('global.overlay.drawers.UpdateProfileDrawer.onDelete.error'), description: error.message, type: 'error', }),
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetProfile(queryClient, userCategory.value))
      addSuccessMessage(t('global.overlay.drawers.UpdateProfileDrawer.onDelete.success'))
    }
  })
}

const { mutate: deleteProfilePictureMutation } = useDeleteUserPhoto()

function deleteProfilePicture ({ fileId }: { fileId: string }) {
  deleteProfilePictureMutation({ fileId }, {
    onError: (error: BaseApiException) => addErrorMessage({ title: t('global.overlay.drawers.UpdateProfileDrawer.onDelete.error'), description: error.message, type: 'error', }),
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetProfile(queryClient, userCategory.value))
      addSuccessMessage(t('global.overlay.drawers.UpdateProfileDrawer.onDelete.success'))
    }
  })
}

function onDeleteCoverPicture () {
  deleteCoverPicture({ fileId: coverPicture.fileId! })
}

function onDeleteProfilePicture () {
  deleteProfilePicture({ fileId: profilePicture.fileId! })
}

function onSubmitForm (event: Event) {
  const submitter = (event as SubmitEvent).submitter as HTMLElement | null

  if (submitter?.closest('[data-image-upload-delete-zone]')) {
    return
  }

  form.handleSubmit()
}

async function handleCancel () {
  if (await canLeave()) {
    onClose()
  }
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
    @escape-pressed="handleCancel"
  >
    <div class="av-col av-gap-xl">
      <AvIconText
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        icon-color="var(--icon)"
        :text="t('global.overlay.drawers.UpdateProfileDrawer.title')"
        text-color="var(--title)"
        typography-class="n6"
        data-testid="drawer-title"
      />
      <form
        id="profile-form"
        novalidate
        @submit.prevent.stop="onSubmitForm"
      >
        <AvAccordionsGroup>
          <AvAccordion
            :title="t('global.overlay.drawers.UpdateProfileDrawer.identity.title')"
            :icon="MDI_ICONS.ACCOUNT_STUDENT_OUTLINE"
            :class="{ 'update-profile-drawer__accordion--error': hasIdentityErrors }"
          >
            <div class="av-col av-gap-md">
              <AvInput
                :label="t('global.overlay.drawers.UpdateProfileDrawer.identity.lastname')"
                :model-value="lastname"
                disabled
              />
              <AvInput
                :label="t('global.overlay.drawers.UpdateProfileDrawer.identity.firstname')"
                :model-value="firstname"
                disabled
              />
              <FormField
                v-if="userCategory === EUserCategory.STUDENT"
                name="email"
              >
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t(`global.overlay.drawers.UpdateProfileDrawer.identity.mail.${userCategory}`)"
                    type="email"
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </FormField>
              <AvInput
                v-else
                :label="t(`global.overlay.drawers.UpdateProfileDrawer.identity.mail.${userCategory}`)"
                :model-value="email"
                disabled
              />
              <FormField
                v-if="userCategory === EUserCategory.STUDENT"
                name="bio"
              >
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('global.overlay.drawers.UpdateProfileDrawer.identity.biography.label')"
                    is-textarea
                    :maxlength="BIOGRAPHY_MAX_LENGTH"
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </FormField>
            </div>
          </AvAccordion>
          <AvAccordion
            :title="t('global.overlay.drawers.UpdateProfileDrawer.pictures.banner')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
            :class="{ 'update-profile-drawer__accordion--error': hasCoverPictureErrors }"
          >
            <div data-image-upload-delete-zone>
              <ImageUpload
                v-model="coverPictureFile"
                :on-delete-image="onDeleteCoverPicture"
                :default-image-url="coverPicture.fileName ? coverPicture.url : undefined"
                :default-image-name="coverPicture.fileName ?? undefined"
                :image-alt="t('global.overlay.drawers.UpdateProfileDrawer.pictures.banner')"
                :on-update="onCoverPictureUpdate"
              />
            </div>
          </AvAccordion>
          <AvAccordion
            :title="t('global.overlay.drawers.UpdateProfileDrawer.pictures.picture')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
            :class="{ 'update-profile-drawer__accordion--error': hasProfilePictureErrors }"
          >
            <div data-image-upload-delete-zone>
              <ImageUpload
                v-model="profilePictureFile"
                :on-delete-image="onDeleteProfilePicture"
                :default-image-url="profilePicture.fileName ? profilePicture.url : undefined"
                :default-image-name="profilePicture.fileName ?? undefined"
                :image-alt="t('global.overlay.drawers.UpdateProfileDrawer.pictures.picture')"
                :on-update="onProfilePictureUpdate"
              />
            </div>
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
          :cancel-is-loading="isPending || isLoading"
          :confirm-is-loading="isPending || isLoading"
          :confirm-disabled="!isModified || !isFormValid"
          form="profile-form"
          @cancel="handleCancel"
          @confirm="confirm"
        />
      </div>
    </template>
  </AvDrawer>
  <ConfirmationModal
    :show="showModal"
    :is-loading="isPending"
    @confirm="confirm"
    @close="cancel"
  />
</template>

<style scoped lang="scss">
.update-profile-drawer__accordion--error {
  :deep(.av-accordion__trigger) {
    border: 1px solid var(--dark-background-error);
    color: var(--dark-background-error);
  }
}
</style>
