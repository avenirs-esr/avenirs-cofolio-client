<script setup lang="ts">
import CreateTraceFormDeclarationItems from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormDeclarationItems/CreateTraceFormDeclarationItems.vue'
import CreateTraceFormTraceDefinitionItems from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormTraceDefinitionItems/CreateTraceFormTraceDefinitionItems.vue'
import {
  useCreateTraceForm
} from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { useToasterStore, useTracesStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvButton, AvDrawer, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tracesStore = useTracesStore()
const { addSuccessMessage } = useToasterStore()

const showDrawer = toRef(tracesStore, 'showCreateTraceDrawer')

function onTraceCreated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.success')
  })
  handleCancel()
}
const { form, isFormValid, isSubmitting } = useCreateTraceForm(onTraceCreated)

const activeAccordion = ref(0)

function handleCancel () {
  form.reset()
  activeAccordion.value = 0
  tracesStore.hideCreateTraceDrawer()
}

async function onSave () {
  await form.handleSubmit()
}
</script>

<template>
  <AvDrawer
    :show="showDrawer"
    position="left"
    width="50rem"
    @escape-pressed="handleCancel"
  >
    <div class="student-tools-traces-add-trace-drawer">
      <h2 class="student-tools-traces-add-trace-drawer__title">
        {{ t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.title') }}
      </h2>

      <div class="student-tools-traces-add-trace-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
            <AvAccordion
              :title="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.addTrace')"
              :icon="MDI_ICONS.IMAGE_OUTLINE"
            >
              <CreateTraceFormTraceDefinitionItems :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.declarations')"
              :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
            >
              <CreateTraceFormDeclarationItems :form="form" />
            </AvAccordion>

            <AvAccordion :title="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.associateTrace')">
              <div class="placeholder-content">
                <p>{{ t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.associateTrace') }} - Contenu à implémenter</p>
              </div>
            </AvAccordion>
          </AvAccordionsGroup>
        </form>
      </div>
    </div>

    <template #footer>
      <div class="student-tools-traces-add-trace-drawer__footer">
        <AvButton
          :label="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.buttons.cancel')"
          variant="OUTLINED"
          type="button"
          @click="handleCancel"
        />
        <AvButton
          :label="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.buttons.save')"
          variant="FLAT"
          type="button"
          :icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          :disabled="!isFormValid"
          :is-loading="isSubmitting"
          @click="onSave"
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
