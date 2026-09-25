<script setup lang="ts">
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { AssociationSelectionSection } from '@/features/student/associations'
import DeclaredExperienceActivitySectorFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.vue'
import DeclaredExperienceDescriptionFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.vue'
import DeclaredExperienceExternalLinkFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceExternalLinkFormField/DeclaredExperienceExternalLinkFormField.vue'
import DeclaredExperienceLocationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.vue'
import DeclaredExperienceOrganizationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.vue'
import DeclaredExperiencePeriodFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.vue'
import DeclaredExperienceResultFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceResultFormField/DeclaredExperienceResultFormField.vue'
import DeclaredExperienceSourceOfInformationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.vue'
import DeclaredExperienceSummaryFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSummaryFormField/DeclaredExperienceSummaryFormField.vue'
import DeclaredExperienceTitleFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.vue'
import DeclaredExperienceTypeFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.vue'
import { useAddDeclaredExperienceForm } from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/use-add-declared-experience-form/use-add-declared-experience-form'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const personalCareerStore = usePersonalCareerStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(personalCareerStore, 'showAddDeclaredExperienceDrawer')

enum AddDeclaredExperienceDrawerAccordions {
  NONE = -1,
  EXPERIENCE_DETAILS = 0,
  ADD_ASSOCIATIONS = 1
}
const activeAccordion = ref<AddDeclaredExperienceDrawerAccordions>(AddDeclaredExperienceDrawerAccordions.EXPERIENCE_DETAILS)

const { form, isFormValid, isSubmitting } = useAddDeclaredExperienceForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.success')
  })
  form.reset()
  personalCareerStore.hideAddDeclaredExperienceDrawer()
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
    personalCareerStore.hideAddDeclaredExperienceDrawer()
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
    <div class="av-col av-gap-lg h-full">
      <span class="n6 av-text-text1">{{ t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.title') }}</span>

      <div class="add-declared-experience-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup
            :active-accordion="activeAccordion"
            @update:active-accordion="(value) => activeAccordion = value ?? AddDeclaredExperienceDrawerAccordions.NONE"
          >
            <AvAccordion
              :title="t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.sections.addExperience')"
              :icon="MDI_ICONS.SCHOOL_OUTLINE"
            >
              <div class="av-col av-gap-md">
                <DeclaredExperienceTitleFormField :form="form" />
                <DeclaredExperienceTypeFormField :form="form" />
                <DeclaredExperienceOrganizationFormField :form="form" />
                <div class="av-col av-row--md av-gap-md">
                  <div class="av-flex-fill">
                    <DeclaredExperienceActivitySectorFormField :form="form" />
                  </div>

                  <div class="av-flex-fill">
                    <DeclaredExperienceLocationFormField :form="form" />
                  </div>
                </div>
                <DeclaredExperiencePeriodFormField :form="form" />
                <DeclaredExperienceResultFormField :form="form" />
                <DeclaredExperienceSourceOfInformationFormField :form="form" />
                <DeclaredExperienceDescriptionFormField :form="form" />
                <DeclaredExperienceSummaryFormField :form="form" />
                <DeclaredExperienceExternalLinkFormField :form="form" />
              </div>
            </AvAccordion>

            <AvAccordion
              :title="t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.sections.associations.title')"
              :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
              data-testid="associate-accordion"
            >
              <AssociationSelectionSection
                :selections="associationSelectionsField.state.value.value"
                :context-type="EAssociationContextType.DECLARED_EXPERIENCE"
                :enabled="activeAccordion === AddDeclaredExperienceDrawerAccordions.ADD_ASSOCIATIONS"
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
    :description="t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
