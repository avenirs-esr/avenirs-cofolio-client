<script setup lang="ts">
import { ConfirmationModal } from '@/common/components'
import { useModal } from '@/common/composables'
import DeclaredSkillLevelRadioButtonSetFormField from '@/features/student/declaredSkills/components/interactions/radios/DeclaredSkillLevelRadioButtonSet/DeclaredSkillLevelRadioButtonSet.vue'
import AddDeclaredSkillAutocompleteField from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/components/AddDeclaredSkillAutocompleteField/AddDeclaredSkillAutocompleteField.vue'
import {
  useDeclaredSkillForm
} from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/use-declared-skill-form/use-declared-skill-form'
import { useDeclaredSkillsStore } from '@/features/student/declaredSkills/stores/declaredSkills.store'
import { useToasterStore } from '@/store'
import { AvCancelConfirmButtons, AvDrawer, AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const declaredSkillsStore = useDeclaredSkillsStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(declaredSkillsStore, 'showCreateDeclaredSkillDrawer')

const { form, isFormValid, isSubmitting } = useDeclaredSkillForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.success')
  })
  form.reset()
  declaredSkillsStore.hideCreateDeclaredSkillDrawer()
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
  declaredSkillsStore.hideCreateDeclaredSkillDrawer()
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
    <div class="add-declared-skill-drawer">
      <div class="add-declared-skill-drawer__header">
        <div class="add-declared-skill-drawer__icon">
          <AvIcon
            :name="MDI_ICONS.PENCIL_OUTLINE"
            :size="1.5"
            color="var(--text2)"
          />
        </div>
        <h2 class="add-declared-skill-drawer__title">
          {{ t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.title') }}
        </h2>
      </div>

      <div class="add-declared-skill-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AddDeclaredSkillAutocompleteField :form="form" />
          <DeclaredSkillLevelRadioButtonSetFormField :form="form" />
        </form>
      </div>
    </div>

    <template #footer>
      <div
        v-memo="[isFormValid, isSubmitting]"
        class="add-declared-skill-drawer__footer"
      >
        <AvCancelConfirmButtons
          :cancel-label="t('global.buttons.cancel')"
          :confirm-label="t('global.buttons.save')"
          :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :confirm-icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          :cancel-disabled="isSubmitting"
          :confirm-disabled="!isFormValid || isSubmitting"
          :confirm-is-loading="isSubmitting"
          @cancel="handleCancel"
          @confirm="form.handleSubmit"
        />
      </div>
    </template>
  </AvDrawer>

  <ConfirmationModal
    :show="showConfirmationModal"
    :description="t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.confirmationModal.description')"
    @close="hideConfirmationModal"
    @confirm="confirmCancel"
  />
</template>

<style scoped lang="scss">
.add-declared-skill-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-lg);
}

.add-declared-skill-drawer__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.add-declared-skill-drawer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-declared-skill-drawer__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text1);
  margin: 0;
}

.add-declared-skill-drawer__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.add-declared-skill-drawer__footer {
  display: flex;
  justify-content: flex-end;
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
