<script setup lang="ts">
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ICONS } from '@/common/constants'
import { AssociationSelectionSection } from '@/features/student/associations'
import DeclaredSkillLevelRadioButtonSetFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.vue'
import DeclaredSkillReflectionFormField
  from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillReflectionFormField/DeclaredSkillReflectionFormField.vue'
import AddDeclaredSkillAutocompleteField
  from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/components/AddDeclaredSkillAutocompleteField/AddDeclaredSkillAutocompleteField.vue'
import {
  useDeclaredSkillForm
} from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/use-declared-skill-form/use-declared-skill-form'
import { useDeclaredSkillsStore } from '@/features/student/declaredSkills/stores/declaredSkills.store'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const declaredSkillsStore = useDeclaredSkillsStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(declaredSkillsStore, 'showCreateDeclaredSkillDrawer')

const { form, isFormValid, isSubmitting, hasSkillDetailsErrors } = useDeclaredSkillForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.success')
  })
  form.reset()
  declaredSkillsStore.hideCreateDeclaredSkillDrawer()
})

const { modalOpened: confirmationModalOpened, openModal: openConfirmationModal, closeModal: closeConfirmationModal } = useModal()

const isDirty = computed(() => {
  const state = form.useStore(state => state)
  return state.value.isDirty
})

const { canLeave, confirm, cancel } = useUnsavedChangesGuard({
  isDirty,
  openModal: openConfirmationModal,
  closeModal: closeConfirmationModal
})

enum AddDeclaredSkillDrawerAccodions {
  NONE = -1,
  ADD_MY_SKILL = 0,
  DECLARATIONS = 1,
  ADD_ASSOCIATIONS = 2
}
const activeAccordion = ref<AddDeclaredSkillDrawerAccodions>(AddDeclaredSkillDrawerAccodions.ADD_MY_SKILL)

const associationSelectionsField = form.useField({ name: 'associationSelections' })

async function handleCancel () {
  if (await canLeave()) {
    form.reset()
    declaredSkillsStore.hideCreateDeclaredSkillDrawer()
  }
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
        <span class="n6 av-text-text1">{{ t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.title') }}</span>
      </div>

      <div
        class="av-col av-gap-lg av-flex-fill"
        data-testid="add-declared-skill-drawer__content"
      >
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup
            :active-accordion="activeAccordion"
            @update:active-accordion="(value) => activeAccordion = value ?? AddDeclaredSkillDrawerAccodions.NONE"
          >
            <AvAccordion
              :title="t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.accordions.addMySkill.title')"
              :icon="ICONS.SKILLS"
              overflow-visible
              :trigger-border-color="hasSkillDetailsErrors ? 'var(--dark-background-error)' : undefined"
            >
              <div class="av-col av-gap-md">
                <AddDeclaredSkillAutocompleteField :form="form" />

                <DeclaredSkillReflectionFormField :form="form" />
              </div>
            </AvAccordion>

            <AvAccordion
              :title="t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.accordions.declarations.title')"
              :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
            >
              <DeclaredSkillLevelRadioButtonSetFormField :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.accordions.addAssociations.title')"
              :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
              data-testid="associate-accordion"
            >
              <AssociationSelectionSection
                :selections="associationSelectionsField.state.value.value"
                :context-type="EAssociationContextType.DECLARED_SKILL"
                :enabled="activeAccordion === AddDeclaredSkillDrawerAccodions.ADD_ASSOCIATIONS"
                layout="vertical"
                @update:selections="associationSelectionsField.api.handleChange"
              />
            </AvAccordion>
          </AvAccordionsGroup>
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
    :opened="confirmationModalOpened"
    :description="t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>

<style lang="scss">
.highlight {
  color: var(--light-foreground-primary1) !important;
  background-color: transparent;
  font-weight: var(--font-weight-bold);
}
</style>
