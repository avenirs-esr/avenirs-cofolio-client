<script setup lang="ts">
import { EAssociationContextType } from '@/api/avenir-esr'
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import { AssociationSelectionSection } from '@/features/student/associations'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import CreateTraceFormDeclarationItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormDeclarationItems/CreateTraceFormDeclarationItems.vue'
import CreateTraceFormTraceDefinitionItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormTraceDefinitionItems/CreateTraceFormTraceDefinitionItems.vue'
import { useCreateTraceForm } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

const ASSOCIATED_CONTEXT_TYPES = [
  EAssociationContextType.DECLARED_SKILL,
  EAssociationContextType.DECLARED_ACTIVITY,
  EAssociationContextType.DECLARED_PROGRAM
]

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
  modalOpened: discardChangesModalOpened,
  openModal: openDiscardChangesModal,
  closeModal: closeDiscardChangesModal
} = useModal()

const {
  canLeave,
  confirm,
  cancel
} = useUnsavedChangesGuard({
  isDirty: isFormDirty,
  openModal: openDiscardChangesModal,
  closeModal: closeDiscardChangesModal
})

const activeAccordion = ref(AddTraceAccordionGroupItems.TRACE)

function confirmCancel () {
  form.reset()
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

const associationSelectionsField = form.useField({ name: 'associationSelections' })
</script>

<template>
  <ConfirmationModal
    :opened="discardChangesModalOpened"
    @confirm="confirm"
    @close="cancel"
  />
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="50rem"
    @escape-pressed="handleCancel"
  >
    <div
      class="av-col av-h-full av-gap-md"
      data-testid="add-trace-drawer-content"
    >
      <span
        class="n6 av-text-text1"
        data-testid="student-tools-traces-add-trace-drawer__title"
      >{{ t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.title') }}</span>

      <div class="av-col av-flex-fill">
        <form
          novalidate
          @submit.prevent.stop
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.addTrace')"
              :icon="MDI_ICONS.IMAGE_OUTLINE"
              :trigger-border-color="hasDefinitionItemsError ? 'var(--dark-background-error)' : undefined"
            >
              <CreateTraceFormTraceDefinitionItems :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.declarations')"
              :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
              :trigger-border-color="hasDeclarationItemsError ? 'var(--dark-background-error)' : undefined"
              data-testid="declaration-accordion"
            >
              <CreateTraceFormDeclarationItems :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.associateTrace')"
              :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
            >
              <AssociationSelectionSection
                :selections="associationSelectionsField.state.value.value"
                :context-type="EAssociationContextType.TRACE"
                :associated-context-types="ASSOCIATED_CONTEXT_TYPES"
                :enabled="activeAccordion === AddTraceAccordionGroupItems.ASSOCIATION"
                data-testid="associate-elements-section"
                @update:selections="associationSelectionsField.api.handleChange"
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
</style>
