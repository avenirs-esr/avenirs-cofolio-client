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
  isPending,
  isModified,
  onCoverPictureUpdate,
  onProfilePictureUpdate,
  resetForm
} = useUpdateProfileForm(studentSummary, onUpdateProfileSuccess)

function onUpdateProfileSuccess () {
  addSuccessMessage(t('student.widgets.overview.updateProfileDrawer.onUpdate.success'))
  onClose()
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
    @escape-pressed="onClose()"
  >
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
        @submit.prevent.stop="form.handleSubmit"
      >
        <AvAccordionsGroup>
          <AvAccordion
            :title="t('student.widgets.overview.updateProfileDrawer.identity.title')"
            :icon="MDI_ICONS.ACCOUNT_STUDENT_OUTLINE"
          >
            <div class="form">
              <form.Field name="lastname">
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('student.widgets.overview.updateProfileDrawer.identity.lastname')"
                    required
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </form.Field>
              <form.Field name="firstname">
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('student.widgets.overview.updateProfileDrawer.identity.firstname')"
                    required
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </form.Field>
              <form.Field name="email">
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('student.widgets.overview.updateProfileDrawer.identity.mail')"
                    type="email"
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </form.Field>
              <form.Field name="bio">
                <template #default="{ field }">
                  <AvInput
                    v-model="field.state.value"
                    :error-message="field.state.meta.errors.join(', ')"
                    :label="t('student.widgets.overview.updateProfileDrawer.identity.description')"
                    is-textarea
                    :maxlength="350"
                    @input="(e: Event) => field.handleChange((e.target as HTMLInputElement).value)"
                  />
                </template>
              </form.Field>
            </div>
          </AvAccordion>
          <AvAccordion
            :title="t('student.widgets.overview.updateProfileDrawer.pictures.banner')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
          >
            <ImageUpload
              :default-image="studentSummary.coverPicture"
              :image-alt="t('student.widgets.overview.updateProfileDrawer.pictures.banner')"
              :on-update="onCoverPictureUpdate"
            />
          </AvAccordion>
          <AvAccordion
            :title="t('student.widgets.overview.updateProfileDrawer.pictures.picture')"
            :icon="MDI_ICONS.IMAGE_OUTLINE"
          >
            <ImageUpload
              :default-image="studentSummary.profilePicture"
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
