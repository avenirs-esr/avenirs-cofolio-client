<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import { useModal } from '@/common/composables'
import AddAdditionalSkillAutocompleteField from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/components/AddAdditionalSkillAutocompleteField/AddAdditionalSkillAutocompleteField.vue'
import { AdditionalSkillLevelFormField } from '@/features/student/components'
import {
  useAdditionalSkillForm
} from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'
import { useSkillsStore, useToasterStore } from '@/store'
import { AvButton, AvDrawer, AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const skillsStore = useSkillsStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(skillsStore, 'showCreateAdditionalSkillDrawer')

const { form, isFormValid, isSubmitting } = useAdditionalSkillForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.success')
  })
  form.reset()
  skillsStore.hideCreateAdditionalSkillDrawer()
})

const { showModal: showConfirmationModal, displayModal: displayConfirmationModal, hideModal: hideConfirmationModal } = useModal()

const isDirty = computed(() => {
  const state = form.useStore(state => state)
  return state.value.isDirty
})

function handleCancel () {
  if (isDirty.value) {
    displayConfirmationModal()
  }
  else {
    confirmCancel()
  }
}

function confirmCancel () {
  form.reset()
  skillsStore.hideCreateAdditionalSkillDrawer()
  hideConfirmationModal()
}
</script>

<template>
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="40rem"
    @escape-pressed="handleCancel"
  >
    <div class="add-additional-skill-drawer">
      <div class="add-additional-skill-drawer__header">
        <div class="add-additional-skill-drawer__icon">
          <AvIcon
            :name="MDI_ICONS.PENCIL_OUTLINE"
            :size="1.5"
            color="var(--text2)"
          />
        </div>
        <h2 class="add-additional-skill-drawer__title">
          {{ t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.title') }}
        </h2>
      </div>

      <div class="add-additional-skill-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AddAdditionalSkillAutocompleteField :form="form" />
          <AdditionalSkillLevelFormField :form="form" />
        </form>
      </div>
    </div>

    <template #footer>
      <div
        v-memo="[isFormValid, isSubmitting]"
        class="add-additional-skill-drawer__footer"
      >
        <AvButton
          :label="t('global.buttons.cancel')"
          variant="OUTLINED"
          type="button"
          :disabled="isSubmitting"
          size="sm"
          :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          @click="handleCancel"
        />
        <AvButton
          :label="t('global.buttons.save')"
          variant="FLAT"
          :disabled="!isFormValid || isSubmitting"
          :is-loading="isSubmitting"
          size="sm"
          :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          @click="form.handleSubmit"
        />
      </div>
    </template>
  </AvDrawer>

  <ConfirmationModal
    :show="showConfirmationModal"
    :description="t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.confirmationModal.description')"
    @close="hideConfirmationModal"
    @confirm="confirmCancel"
  />
</template>

<style scoped lang="scss">
.add-additional-skill-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-lg);
}

.add-additional-skill-drawer__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.add-additional-skill-drawer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-additional-skill-drawer__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text1);
  margin: 0;
}

.add-additional-skill-drawer__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.add-additional-skill-drawer__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}
</style>

<style lang="scss">
.highlight {
  color: var(--light-foreground-primary1) !important;
  background-color: transparent;
  font-weight: var(--font-weight-bold);
}
</style>
