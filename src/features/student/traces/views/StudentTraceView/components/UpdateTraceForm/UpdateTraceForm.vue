<script setup lang="ts">
import type { TraceDetailDTO } from '@/api/avenir-esr'
import { useDateUtils } from '@/common/composables'
import {
  TraceAiJustificationTextareaFormField,
  TraceAiUsageToggleFormField,
  TraceAuthenticDeclarationToggleFormField,
  TraceFileUploadFormField,
  TraceGroupProductionToggleFormField,
  TraceNameInputFormField,
  TracePersonalNoteTextareaFormField
} from '@/features/student/traces'
import { useTracesStore } from '@/features/student/traces/stores/traces/traces'
import { useUpdateTraceForm } from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceForm/use-update-trace-form/use-update-trace-form'
import { useToasterStore } from '@/store'
import { useI18n } from 'vue-i18n'

const { trace } = defineProps<UpdateTraceFormProps>()
interface UpdateTraceFormProps {
  trace: TraceDetailDTO
}

const { addSuccessMessage } = useToasterStore()
const { hideUpdateTraceModal } = useTracesStore()

const { t } = useI18n()

function onTraceUpdated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.views.studentTraceView.updateTraceModal.success')
  })
  hideUpdateTraceModal()
}

const { form } = useUpdateTraceForm(trace, onTraceUpdated)
const { formatTranslatedDateTime } = useDateUtils()

const useIAField = form.useField({ name: 'useIA' })
const iaJustificationField = form.useField({ name: 'iaJustification' })

const showIAJustification = computed(() => useIAField.state.value.value === true)

function onChangeAiUsageToggle (value: boolean) {
  if (!value) {
    iaJustificationField.api.handleChange('')
  }
}
const traceFileUploadLabel = computed(() => {
  const uploadDate = formatTranslatedDateTime(trace.attachment.uploadedAt)
  return `${t('student.traces.traceFileUpload.documentLabel')} - ${t('student.traces.traceFileUpload.addedOn', { date: uploadDate })}`
})
</script>

<template>
  <form
    class="update-trace-form"
    novalidate
    @submit.prevent.stop="form.handleSubmit"
  >
    <div class="update-trace-form__row">
      <div class="update-trace-form__col">
        <TraceNameInputFormField :form="form" />

        <TraceFileUploadFormField
          :form="form"
          :label="traceFileUploadLabel"
        />
      </div>

      <div class="update-trace-form__col">
        <TracePersonalNoteTextareaFormField :form="form" />
      </div>
    </div>

    <div class="update-trace-form__row">
      <div class="update-trace-form__col">
        <div class="update-trace-form__section">
          <span class="caption-regular">
            {{ t('student.views.studentTraceView.updateTraceModal.updateTraceForm.declaration.productionNature.title') }}
          </span>

          <div class="update-trace-form__toggles">
            <div class="update-trace-form__toggle">
              <TraceAuthenticDeclarationToggleFormField :form="form" />
            </div>

            <div class="update-trace-form__toggle">
              <TraceGroupProductionToggleFormField :form="form" />
            </div>
          </div>
        </div>
      </div>

      <div class="update-trace-form__col">
        <div class="update-trace-form__section">
          <span class="caption-regular">
            {{ t('student.views.studentTraceView.updateTraceModal.updateTraceForm.declaration.iaUsage.title') }}
          </span>

          <div class="update-trace-form__toggle">
            <TraceAiUsageToggleFormField
              :form="form"
              @change="onChangeAiUsageToggle"
            />
          </div>

          <TraceAiJustificationTextareaFormField
            :form="form"
            :show-ai-justification="showIAJustification"
            :label-visible="false"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped lang="scss">
.update-trace-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 100%;
}

.update-trace-form__row {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-lg);
  width: 100%;
}

.update-trace-form__col {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  flex: 1;
  min-width: 0;
}

.update-trace-form__toggles {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;

  .update-trace-form__toggle {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xxs);
    flex: 0 0 auto;

    :deep(.av-toggle) {
      max-width: 20rem;
    }
  }
}

.update-trace-form__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
