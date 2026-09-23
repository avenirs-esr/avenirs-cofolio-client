<script setup lang="ts">
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import AssociationSelectionSection from '@/features/student/associations/components/sections/AssociationSelectionSection/AssociationSelectionSection.vue'
import DeclaredProgramDescriptionFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramDescriptionFormField/DeclaredProgramDescriptionFormField.vue'
import DeclaredProgramOrganizationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramOrganizationFormField/DeclaredProgramOrganizationFormField.vue'
import DeclaredProgramPeriodFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.vue'
import DeclaredProgramResultFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramResultFormField/DeclaredProgramResultFormField.vue'
import DeclaredProgramSourceOfInformationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramSourceOfInformationFormField/DeclaredProgramSourceOfInformationFormField.vue'
import DeclaredProgramTitleFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramTitleFormField/DeclaredProgramTitleFormField.vue'
import { useAddDeclaredProgramForm } from '@/features/student/personalCareer/components/overlays/AddDeclaredProgramDrawer/use-add-declared-program-form/use-add-declared-program-form'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const declaredProgramsStore = usePersonalCareerStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(declaredProgramsStore, 'showAddDeclaredProgramDrawer')

const { form, isFormValid, isSubmitting, hasDefinitionItemsError } = useAddDeclaredProgramForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.personalCareer.overlays.AddDeclaredProgramDrawer.success')
  })
  form.reset()
  declaredProgramsStore.hideAddDeclaredProgramDrawer()
})

const associationSelectionsField = form.useField({ name: 'associationSelections' })

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

async function handleCancel () {
  if (await canLeave()) {
    form.reset()
    declaredProgramsStore.hideAddDeclaredProgramDrawer()
  }
}

enum AddDeclaredProgramDrawerAccordions {
  NONE = -1,
  PROGRAM_DETAILS = 0,
  ADD_ASSOCIATIONS = 1
}
const activeAccordion = ref<AddDeclaredProgramDrawerAccordions>(AddDeclaredProgramDrawerAccordions.PROGRAM_DETAILS)
</script>

<template>
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="40rem"
    @escape-pressed="handleCancel"
  >
    <div class="av-col av-gap-lg h-full">
      <AvIconText
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        :text="t('student.personalCareer.overlays.AddDeclaredProgramDrawer.title')"
        typography-class="n5"
        icon-color="var(--text2)"
      />

      <div class="add-declared-program-drawer__content">
        <form
          novalidate
          data-testid="add-declared-program-form"
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup
            :active-accordion="activeAccordion"
            @update:active-accordion="(value) => activeAccordion = value ?? AddDeclaredProgramDrawerAccordions.NONE"
          >
            <AvAccordion
              :title="t('student.personalCareer.overlays.AddDeclaredProgramDrawer.sections.addProgram')"
              :icon="MDI_ICONS.PENCIL_OUTLINE"
              :trigger-border-color="hasDefinitionItemsError ? 'var(--dark-background-error)' : undefined"
            >
              <div class="av-col av-gap-md">
                <DeclaredProgramTitleFormField :form />
                <DeclaredProgramDescriptionFormField :form />
                <DeclaredProgramOrganizationFormField :form />
                <DeclaredProgramPeriodFormField :form />
                <DeclaredProgramResultFormField :form />
                <DeclaredProgramSourceOfInformationFormField :form />
              </div>
            </AvAccordion>

            <AvAccordion
              :title="t('student.personalCareer.overlays.AddDeclaredProgramDrawer.sections.associateProgram')"
              :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
              data-testid="associate-accordion"
            >
              <AssociationSelectionSection
                :selections="associationSelectionsField.state.value.value"
                :context-type="EAssociationContextType.DECLARED_PROGRAM"
                :enabled="activeAccordion === AddDeclaredProgramDrawerAccordions.ADD_ASSOCIATIONS"
                layout="vertical"
                data-testid="associate-elements-section"
                @update:selections="associationSelectionsField.api.handleChange"
              />
            </AvAccordion>
          </AvAccordionsGroup>
        </form>
      </div>
    </div>

    <template #footer>
      <div
        v-memo="[isFormValid, isSubmitting]"
        class="av-row av-justify-end av-p-md"
      >
        <FormCancelConfirmButtons
          :is-submitting="isSubmitting"
          :is-form-valid="isFormValid"
          @cancel="handleCancel"
          @submit="form.handleSubmit"
        />
      </div>
    </template>
  </AvDrawer>

  <ConfirmationModal
    :opened="confirmationModalOpened"
    :description="t('student.personalCareer.overlays.AddDeclaredProgramDrawer.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
