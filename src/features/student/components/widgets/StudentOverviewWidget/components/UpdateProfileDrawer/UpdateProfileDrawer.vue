<script setup lang="ts">
import type { ProfileOverviewDTO } from '@/api/avenir-esr'
import { ImageUpload } from '@/common/components'
import { useModal } from '@/common/composables'
import UpdateExitConfirmationModal from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateExitConfirmationModal/UpdateExitConfirmationModal.vue'
import { useUpdateProfileForm } from '@/features/student/components/widgets/StudentOverviewWidget/components/UpdateProfileDrawer/use-update-profile-form'
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
import { useI18n } from 'vue-i18n'

const { studentSummary, show, onClose } = defineProps<{
  studentSummary: ProfileOverviewDTO
  show: boolean
  onClose: () => void
}>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
const { addSuccessMessage } = useToasterStore()
const {
  form,
  formErrors,
  coverPictureFile,
  profilePictureFile,
  isPending,
  isModified,
  handleSubmit,
  resetForm
} = useUpdateProfileForm(studentSummary, onUpdateProfileSuccess)

function onUpdateProfileSuccess () {
  addSuccessMessage(t('student.widgets.overview.updateProfileDrawer.onUpdate.success'))
  onClose()
}

function onCoverPictureUpdate (file: File | null) {
  coverPictureFile.value = file
}

function onProfilePictureUpdate (file: File | null) {
  profilePictureFile.value = file
}

watch(() => show, (newVal) => {
  if (newVal) {
    resetForm({
      firstname: studentSummary.firstname,
      lastname: studentSummary.lastname,
      bio: studentSummary.bio,
      email: studentSummary.email,
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
          size="sm"
          :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :label="t('global.buttons.exit')"
          :is-loading="isPending"
          :on-click="isModified ? displayModal : onClose"
        />
        <AvButton
          variant="FLAT"
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
