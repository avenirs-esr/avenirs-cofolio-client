<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import { EUserCategory, type PictureDTO } from '@/api/avenir-esr'
import { ConfirmationModal, ImageUpload } from '@/common/components'
import { BIOGRAPHY_MAX_LENGTH } from '@/common/components/overlay/drawers/UpdateProfileDrawer/config'
import { useUpdateProfileForm } from '@/common/components/overlay/drawers/UpdateProfileDrawer/use-update-profile-form'
import { useModal } from '@/common/composables'
import { useDeletePhotoMutation } from '@/common/queries/use-user-profile/use-user-profile.query'
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

interface UpdateProfileDrawerProps {
  firstname: string
  lastname: string
  bio?: string
  email: string
  profilePicture: PictureDTO
  coverPicture: PictureDTO
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

const userCategory = computed<EUserCategory>(() => route.path.startsWith('/student') ? EUserCategory.STUDENT : EUserCategory.STAFF)

const {
  form,
  isPending,
  isModified,
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

const { mutate: deleteCoverPicture } = useDeletePhotoMutation(userCategory.value, {
  onError: (error: BaseApiException) => addErrorMessage({ title: t('global.overlay.drawers.UpdateProfileDrawer.onDelete.error'), description: error.message, type: 'error', }),
})

const { mutate: deleteProfilePicture } = useDeletePhotoMutation(userCategory.value, {
  onError: (error: BaseApiException) => addErrorMessage({ title: t('global.overlay.drawers.UpdateProfileDrawer.onDelete.error'), description: error.message, type: 'error', }),
})

function onDeleteCoverPicture () {
  deleteCoverPicture({ fileId: coverPicture.fileId! })
}

function onDeleteProfilePicture () {
  deleteProfilePicture({ fileId: profilePicture.fileId! })
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
    @escape-pressed="isModified ? displayModal() : onClose()"
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
        @submit.prevent.stop="form.handleSubmit"
      >
        <AvAccordionsGroup>
          <AvAccordion
            :title="t('global.overlay.drawers.UpdateProfileDrawer.identity.title')"
            :icon="MDI_ICONS.ACCOUNT_STUDENT_OUTLINE"
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
          >
            <ImageUpload
              v-model="coverPictureFile"
              :on-delete-image="onDeleteCoverPicture"
              :default-image-url="coverPicture.fileName ? coverPicture.url : undefined"
              :default-image-name="coverPicture.fileName ?? undefined"
              :image-alt="t('global.overlay.drawers.UpdateProfileDrawer.pictures.banner')"
              :on-update="onCoverPictureUpdate"
            />
          </AvAccordion>
          <AvAccordion
            :title="t('global.overlay.drawers.UpdateProfileDrawer.pictures.picture')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
          >
            <ImageUpload
              v-model="profilePictureFile"
              :on-delete-image="onDeleteProfilePicture"
              :default-image-url="profilePicture.fileName ? profilePicture.url : undefined"
              :default-image-name="profilePicture.fileName ?? undefined"
              :image-alt="t('global.overlay.drawers.UpdateProfileDrawer.pictures.picture')"
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
