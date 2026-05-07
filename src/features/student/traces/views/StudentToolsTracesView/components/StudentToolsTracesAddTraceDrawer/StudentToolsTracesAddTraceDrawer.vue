<script setup lang="ts">
import type { Association } from '@/features/student/global/types/associations.types'
import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import {
  EAssociationContextType,
  useSearchDeclaredActivitiesForAssociation,
  useSearchDeclaredSkillsForAssociation,
} from '@/api/avenir-esr'
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { useDeclaredActivityAssociation } from '@/features/student/buildProject'
import { useDeclaredSkillAssociation } from '@/features/student/declaredSkills'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { EAssociationTypeKey } from '@/features/student/traces/types/traces.types'
import AssociateElementsDrawerSection from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociateElementsDrawerSection/AssociateElementsDrawerSection.vue'
import CreateTraceFormDeclarationItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormDeclarationItems/CreateTraceFormDeclarationItems.vue'
import CreateTraceFormTraceDefinitionItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormTraceDefinitionItems/CreateTraceFormTraceDefinitionItems.vue'
import { useCreateTraceForm } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

enum AddTraceAccordionGroupItems {
  TRACE = 0,
  DECLARATION = 1,
  ASSOCIATION = 2
}

const { t } = useI18n()
const tracesStore = useTracesStore()
const { addSuccessMessage } = useToasterStore()

const showDrawer = toRef(tracesStore, 'showCreateTraceDrawer')

const searchQuery = ref('')
const activeTypeKey = ref<string>(EAssociationTypeKey.DECLARED_SKILLS)

function onTraceCreated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.success')
  })
  confirmCancel()
}

const { form, isFormValid, isSubmitting, hasDeclarationItemsError, hasDefinitionItemsError } = useCreateTraceForm(onTraceCreated)

const isFormDirty = form.useStore(state => state.isDirty)

const {
  showModal: showDiscardChangesModal,
  displayModal: displayDiscardChangesModal,
  hideModal: hideDiscardChangesModal
} = useModal()

const {
  canLeave,
  confirm,
  cancel
} = useUnsavedChangesGuard({
  isDirty: isFormDirty,
  openModal: displayDiscardChangesModal,
  closeModal: hideDiscardChangesModal
})

const { declaredSkillToAssociation } = useDeclaredSkillAssociation()
const { declaredActivityToAssociation } = useDeclaredActivityAssociation()

const activeAccordion = ref(AddTraceAccordionGroupItems.TRACE)

function confirmCancel () {
  form.reset()
  searchQuery.value = ''
  activeTypeKey.value = EAssociationTypeKey.DECLARED_SKILLS
  activeAccordion.value = 0
  tracesStore.hideCreateTraceDrawer()
}

async function handleCancel () {
  if (await canLeave()) {
    confirmCancel()
  }
}

async function onSave () {
  await form.handleSubmit()
}

const searchParams = computed(() => ({
  keyword: searchQuery.value.trim(),
  page: 0,
  pageSize: 100,
}))

const {
  data: skills,
  isLoading: isSkillsLoading
} = useSearchDeclaredSkillsForAssociation(
  computed(() => ({ contextType: EAssociationContextType.TRACE, ...searchParams.value })),
  {
    query: {
      enabled: computed(() => activeAccordion.value === AddTraceAccordionGroupItems.ASSOCIATION && activeTypeKey.value === EAssociationTypeKey.DECLARED_SKILLS),
      select: response => response.data,
    }
  }
)

const {
  data: activities,
  isLoading: isActivitiesLoading
} = useSearchDeclaredActivitiesForAssociation(
  computed(() => ({ contextType: EAssociationContextType.TRACE, ...searchParams.value })),
  {
    query: {
      enabled: computed(() => activeAccordion.value === AddTraceAccordionGroupItems.ASSOCIATION && activeTypeKey.value === EAssociationTypeKey.ACTIVITIES),
      select: response => response.data,
    }
  }
)

const typeConfigs = computed<AssociateElementTypeConfig[]>(() => [
  {
    key: EAssociationTypeKey.DECLARED_SKILLS,
    label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.types.declaredSkills'),
    searchPlaceholder: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.searchPlaceholder.declaredSkills')
  },
  {
    key: EAssociationTypeKey.ACTIVITIES,
    label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.types.activities'),
    searchPlaceholder: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.searchPlaceholder.activities')
  }
])

const currentOptions = computed<Association[]>(() => {
  if (activeTypeKey.value === EAssociationTypeKey.DECLARED_SKILLS) {
    return skills.value?.map(declaredSkillToAssociation) ?? []
  }
  return activities.value?.map(declaredActivityToAssociation) ?? []
})

const isSearchLoading = computed(() => {
  return isActivitiesLoading.value || isSkillsLoading.value
})

watch(activeTypeKey, () => {
  searchQuery.value = ''
})

const associationSelectionsField = form.useField({ name: 'associationSelections' })
</script>

<template>
  <ConfirmationModal
    :show="showDiscardChangesModal"
    @confirm="confirm"
    @close="cancel"
  />
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="50rem"
    @escape-pressed="handleCancel"
  >
    <div class="av-col av-h-full av-gap-md">
      <AvIconText
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        icon-color="var(--icon)"
        :text="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.title')"
        text-color="var(--title)"
        typography-class="n6"
        gap="var(--spacing-xs)"
        data-testid="student-tools-traces-add-trace-drawer__title"
      />

      <div class="av-col av-flex-fill">
        <form
          novalidate
          @submit.prevent.stop
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.addTrace')"
              :icon="MDI_ICONS.IMAGE_OUTLINE"
              :class="{ 'add-trace-drawer__accordion--error': hasDefinitionItemsError }"
            >
              <CreateTraceFormTraceDefinitionItems :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.declarations')"
              :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
              :class="{ 'add-trace-drawer__accordion--error': hasDeclarationItemsError }"
            >
              <CreateTraceFormDeclarationItems :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.associateTrace')"
              :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
            >
              <AssociateElementsDrawerSection
                v-model:active-type-key="activeTypeKey"
                v-model:search-query="searchQuery"
                :selections-by-type="associationSelectionsField.state.value.value"
                :type-configs="typeConfigs"
                :options="currentOptions"
                :loading="isSearchLoading"
                data-testid="associate-elements-section"
                @update:selections-by-type="associationSelectionsField.api.handleChange"
              />
            </AvAccordion>
          </AvAccordionsGroup>
        </form>
      </div>
    </div>

    <template #footer>
      <div class="av-row av-justify-end av-gap-sm av-p-md">
        <FormCancelConfirmButtons
          :cancel-label="t('global.buttons.exit')"
          :is-submitting="isSubmitting"
          :is-form-valid="isFormValid"
          @cancel="handleCancel"
          @submit="onSave"
        />
      </div>
    </template>
  </AvDrawer>
</template>

<style scoped lang="scss">
.placeholder-content {
  font-style: italic;
}

.add-trace-drawer__accordion--error {
  :deep(.av-accordion__trigger) {
    border: 1px solid var(--dark-background-error);
    color: var(--dark-background-error);
  }
}
</style>
