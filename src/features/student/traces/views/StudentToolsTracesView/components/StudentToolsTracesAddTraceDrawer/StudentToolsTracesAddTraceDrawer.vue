<script setup lang="ts">
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import CreateTraceFormDeclarationItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormDeclarationItems/CreateTraceFormDeclarationItems.vue'
import CreateTraceFormTraceDefinitionItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormTraceDefinitionItems/CreateTraceFormTraceDefinitionItems.vue'
import {
  useCreateTraceForm
} from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tracesStore = useTracesStore()
const { addSuccessMessage } = useToasterStore()

const showDrawer = toRef(tracesStore, 'showCreateTraceDrawer')

function onTraceCreated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.success')
  })
  confirmCancel()
}
const { form, isFormValid, isSubmitting } = useCreateTraceForm(onTraceCreated)

const isFormDirty = form.useStore(state => state.isDirty)

const {
  showModal: showDiscardChangesModal,
  displayModal: displayDiscardChangesModal,
  hideModal: hideDiscardChangesModal
} = useModal()

const activeAccordion = ref(0)

function confirmCancel () {
  form.reset()
  activeAccordion.value = 0
  tracesStore.hideCreateTraceDrawer()
  hideDiscardChangesModal()
}

function handleCancel () {
  if (isFormDirty.value) {
    displayDiscardChangesModal()
  }
  else {
    confirmCancel()
  }
}

async function onSave () {
  await form.handleSubmit()
}
</script>

<template>
  <ConfirmationModal
    :show="showDiscardChangesModal"
    @confirm="confirmCancel"
    @close="hideDiscardChangesModal"
  />
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="50rem"
    @escape-pressed="handleCancel"
  >
    <div class="student-tools-traces-add-trace-drawer">
      <h2 class="student-tools-traces-add-trace-drawer__title">
        {{ t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.title') }}
      </h2>

      <div class="student-tools-traces-add-trace-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.addTrace')"
              :icon="MDI_ICONS.IMAGE_OUTLINE"
            >
              <CreateTraceFormTraceDefinitionItems :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.declarations')"
              :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
            >
              <CreateTraceFormDeclarationItems :form="form" />
            </AvAccordion>

            <AvAccordion :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.associateTrace')">
              <div class="placeholder-content">
                <p>{{ t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.associateTrace') }} - Contenu à implémenter</p>
              </div>
            </AvAccordion>
          </AvAccordionsGroup>
        </form>
      </div>
    </div>

    <template #footer>
      <div class="student-tools-traces-add-trace-drawer__footer">
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
.student-tools-traces-add-trace-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-md);
}

.student-tools-traces-add-trace-drawer__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text1);
  margin: 0;
}

.student-tools-traces-add-trace-drawer__content {
  flex: 1;
}

.placeholder-content {
  padding: var(--spacing-md);
  color: var(--text2);
  font-style: italic;
}

.student-tools-traces-add-trace-drawer__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}
</style>
