<script setup lang="ts">
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import DeclaredSkillLevelRadioButtonSetFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.vue'
import AddDeclaredSkillAutocompleteField from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/components/AddDeclaredSkillAutocompleteField/AddDeclaredSkillAutocompleteField.vue'
import {
  useDeclaredSkillForm
} from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/use-declared-skill-form/use-declared-skill-form'
import { useDeclaredSkillsStore } from '@/features/student/declaredSkills/stores/declaredSkills.store'
import { useToasterStore } from '@/store'
import { AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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
    <div
      class="av-col av-h-full av-gap-lg"
      data-testid="add-declared-skill-drawer"
    >
      <div data-testid="add-declared-skill-drawer__header">
        <AvIconText
          :icon="MDI_ICONS.PENCIL_OUTLINE"
          icon-color="var(--text2)"
          :text="t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.title')"
          text-color="var(--text1)"
          typography-class="n6"
        />
      </div>

      <div
        class="av-col av-gap-lg av-flex-fill"
        data-testid="add-declared-skill-drawer__content"
      >
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
        v-memo="[isFormValid, isDirty, isSubmitting]"
        class="av-row av-justify-end av-p-md"
        data-testid="add-declared-skill-drawer__footer"
      >
        <FormCancelConfirmButtons
          :is-submitting="isSubmitting"
          :is-form-valid="isFormValid && isDirty"
          @cancel="handleCancel"
          @submit="form.handleSubmit"
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

<style lang="scss">
.highlight {
  color: var(--light-foreground-primary1) !important;
  background-color: transparent;
  font-weight: var(--font-weight-bold);
}
</style>
