<script setup lang="ts">
import type { Association } from '@/features/student/global/types/associations.types'
import { EAssociationContextType, useSearchDeclaredActivitiesForAssociation } from '@/api/avenir-esr'
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { ICONS } from '@/common/constants'
import { useDeclaredActivityAssociation } from '@/features/student/buildProject'
import DeclaredSkillLevelRadioButtonSetFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.vue'
import DeclaredSkillReflectionFormField
  from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillReflectionFormField/DeclaredSkillReflectionFormField.vue'
import AddDeclaredSkillAutocompleteField
  from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/components/AddDeclaredSkillAutocompleteField/AddDeclaredSkillAutocompleteField.vue'
import {
  useDeclaredSkillForm
} from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/use-declared-skill-form/use-declared-skill-form'
import { useDeclaredSkillsStore } from '@/features/student/declaredSkills/stores/declaredSkills.store'
import { type AssociateElementTypeConfig, EAssociationTypeKey } from '@/features/student/traces/types/traces.types'
import AssociateElementsDrawerSection from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociateElementsDrawerSection/AssociateElementsDrawerSection.vue'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, AvIconText, MDI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
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

const { showModal: showConfirmationModal, displayModal: displayConfirmationModal, hideModal: hideConfirmationModal } = useModal()
const { isMobile } = useAvBreakpoints()

const isDirty = computed(() => {
  const state = form.useStore(state => state)
  return state.value.isDirty
})

const { canLeave, confirm, cancel } = useUnsavedChangesGuard({
  isDirty,
  openModal: displayConfirmationModal,
  closeModal: hideConfirmationModal
})

const associationSelectionsField = form.useField({ name: 'associationSelections' })

const associationActiveType = ref<string>(EAssociationTypeKey.ACTIVITIES)
const associationSearchQuery = ref<string>('')

const associationTypesConfigs = computed<AssociateElementTypeConfig[]>(() => [
  {
    key: EAssociationTypeKey.ACTIVITIES,
    label: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.accordions.addAssociations.types.activities.label'),
    searchPlaceholder: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.accordions.addAssociations.types.activities.placeholder')
  }
])
const associationSearchParams = computed(() => ({
  contextType: EAssociationContextType.DECLARED_SKILL,
  keyword: associationSearchQuery.value.trim(),
  page: 0,
  pageSize: 100,
}))

const { declaredActivityToAssociation } = useDeclaredActivityAssociation()
const {
  data: activitiesToAssociate,
  isLoading: isActivitiesLoading
} = useSearchDeclaredActivitiesForAssociation(associationSearchParams, {
  query: {
    select: response => response.data.map(declaredActivityToAssociation),
  }
})

const associationOptions = computed<Association[]>(() => activitiesToAssociate.value ?? [])
const isAssociationSearchLoading = computed(() => isActivitiesLoading.value)

async function handleCancel () {
  if (await canLeave()) {
    form.reset()
    associationSearchQuery.value = ''
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
        <AvIconText
          :icon="MDI_ICONS.PENCIL_OUTLINE"
          icon-color="var(--text2)"
          :text="t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.title')"
          text-color="var(--text1)"
          typography-class="n6"
          :inline="isMobile"
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
          <AvAccordionsGroup>
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
              <AssociateElementsDrawerSection
                v-model:active-type-key="associationActiveType"
                v-model:search-query="associationSearchQuery"
                :selections-by-type="associationSelectionsField.state.value.value"
                :type-configs="associationTypesConfigs"
                :options="associationOptions"
                :loading="isAssociationSearchLoading"
                layout="vertical"
                @update:selections-by-type="associationSelectionsField.api.handleChange"
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
    :show="showConfirmationModal"
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
