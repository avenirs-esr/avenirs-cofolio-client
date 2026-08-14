<script setup lang="ts">
import type { Association } from '@/features/student/global/types/associations.types'
import type { DeclaredExperienceAssociationContextType } from '@/features/student/personalCareer/types/declared-experience.types'
import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import {
  EAssociationContextType,
  useSearchDeclaredSkillsForAssociation,
  useSearchTracesForAssociation
} from '@/api/avenir-esr'
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { useDeclaredSkillAssociation } from '@/features/student/declaredSkills'
import DeclaredExperienceActivitySectorFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.vue'
import DeclaredExperienceDescriptionFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.vue'
import DeclaredExperienceExternalLinkFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceExternalLinkFormField/DeclaredExperienceExternalLinkFormField.vue'
import DeclaredExperienceLocationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.vue'
import DeclaredExperienceOrganizationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.vue'
import DeclaredExperiencePeriodFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.vue'
import DeclaredExperienceSourceOfInformationFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.vue'
import DeclaredExperienceSummaryFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSummaryFormField/DeclaredExperienceSummaryFormField.vue'
import DeclaredExperienceTitleFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.vue'
import DeclaredExperienceTypeFormField from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.vue'
import { useAddDeclaredExperienceForm } from '@/features/student/personalCareer/components/overlays/AddDeclaredExperienceDrawer/use-add-declared-experience-form/use-add-declared-experience-form'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import AssociateElementsDrawerSection from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociateElementsDrawerSection/AssociateElementsDrawerSection.vue'
import { useTraceAssociationModal } from '@/features/student/traces/composables/use-trace-associations/use-trace-associations'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const personalCareerStore = usePersonalCareerStore()
const { addSuccessMessage } = useToasterStore()
const showDrawer = toRef(personalCareerStore, 'showAddDeclaredExperienceDrawer')
const activeAccordion = ref(0)

const { form, isFormValid, isSubmitting } = useAddDeclaredExperienceForm(() => {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.success')
  })
  form.reset()
  personalCareerStore.hideAddDeclaredExperienceDrawer()
})

const associationSelectionsField = form.useField({ name: 'associationSelections' })
const associationActiveType = ref<DeclaredExperienceAssociationContextType>(EAssociationContextType.DECLARED_SKILL)
const associationSearchQuery = ref('')

const associationTypesConfigs = computed<AssociateElementTypeConfig[]>(() => [
  {
    key: EAssociationContextType.DECLARED_SKILL,
    label: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.sections.associations.types.declaredSkills.label'),
    searchPlaceholder: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.sections.associations.types.declaredSkills.placeholder')
  },
  {
    key: EAssociationContextType.TRACE,
    label: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.sections.associations.types.traces.label'),
    searchPlaceholder: t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.sections.associations.types.traces.placeholder')
  }
])

const associationSearchParams = computed(() => ({
  contextType: EAssociationContextType.DECLARED_EXPERIENCE,
  keyword: associationSearchQuery.value.trim(),
  page: 0,
  pageSize: 100,
}))

const { declaredSkillToAssociation } = useDeclaredSkillAssociation()
const { mapTraceAssociationSearchResultToAssociation } = useTraceAssociationModal()
const {
  data: declaredSkillsToAssociate,
  isLoading: isDeclaredSkillsLoading
} = useSearchDeclaredSkillsForAssociation(associationSearchParams, {
  query: {
    select: response => response.data.map(declaredSkillToAssociation),
    enabled: computed(() => showDrawer.value)
  }
})

const {
  data: tracesToAssociate,
  isLoading: isTracesLoading
} = useSearchTracesForAssociation(associationSearchParams, {
  query: {
    select: response => response.data.map(mapTraceAssociationSearchResultToAssociation),
    enabled: computed(() => showDrawer.value)
  }
})

const declaredSkillAssociationOptions = computed<Association[]>(() => declaredSkillsToAssociate.value ?? [])

const traceAssociationOptions = computed<Association[]>(() => tracesToAssociate.value ?? [])

const associationOptions = computed<Association[]>(() => {
  if (associationActiveType.value === EAssociationContextType.TRACE) {
    return traceAssociationOptions.value
  }

  return declaredSkillAssociationOptions.value
})

const isAssociationSearchLoading = computed(() => {
  if (associationActiveType.value === EAssociationContextType.TRACE) {
    return isTracesLoading.value
  }

  return isDeclaredSkillsLoading.value
})

const { showModal: showConfirmationModal, displayModal: displayConfirmationModal, hideModal: hideConfirmationModal } = useModal()

const isDirty = computed(() => {
  const state = form.useStore(state => state)
  return state.value.isDirty
})

const { canLeave, confirm, cancel } = useUnsavedChangesGuard({
  isDirty,
  openModal: displayConfirmationModal,
  closeModal: hideConfirmationModal
})

async function handleCancel () {
  if (await canLeave()) {
    form.reset()
    associationSearchQuery.value = ''
    associationActiveType.value = EAssociationContextType.DECLARED_SKILL
    personalCareerStore.hideAddDeclaredExperienceDrawer()
  }
}

watch(associationActiveType, () => {
  associationSearchQuery.value = ''
})
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
        :text="t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.title')"
        typography-class="n5"
        icon-color="var(--text2)"
      />

      <div class="add-declared-experience-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
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
              <AssociateElementsDrawerSection
                v-model:active-type-key="associationActiveType"
                v-model:search-query="associationSearchQuery"
                :selections-by-type="associationSelectionsField.state.value.value"
                :type-configs="associationTypesConfigs"
                :options="associationOptions"
                :loading="isAssociationSearchLoading"
                layout="vertical"
                data-testid="associate-elements-section"
                @update:selections-by-type="associationSelectionsField.api.handleChange"
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
    :show="showConfirmationModal"
    :description="t('student.personalCareer.overlays.AddDeclaredExperienceDrawer.confirmationModal.description')"
    @close="cancel"
    @confirm="confirm"
  />
</template>
