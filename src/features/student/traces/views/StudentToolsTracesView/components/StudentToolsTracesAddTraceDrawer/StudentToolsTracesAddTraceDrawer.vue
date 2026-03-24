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
import { AvAccordion, AvAccordionsGroup, AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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
              <div class="placeholder-content av-text-text2 av-p-md">
                <p>{{ t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.associateTrace') }} - Contenu à implémenter</p>
              </div>
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
