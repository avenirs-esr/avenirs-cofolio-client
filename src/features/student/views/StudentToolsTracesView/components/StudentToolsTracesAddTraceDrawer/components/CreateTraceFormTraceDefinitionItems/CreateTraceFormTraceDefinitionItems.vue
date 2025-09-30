<script setup lang="ts">
import type {
  CreateTraceForm
} from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { TraceFileUpload, TraceNameInput, TracePersonalNoteTextarea } from '@/features/student/components/inputs'
import { useI18n } from 'vue-i18n'

interface CreateTraceFormTraceDefinitionItemsProps {
  form: CreateTraceForm
}

const props = defineProps<CreateTraceFormTraceDefinitionItemsProps>()
const form: CreateTraceForm = props.form

const { t } = useI18n()

function handleFileChange (files: FileList, handleChange: (file: File) => void) {
  if (files.length > 0) {
    handleChange(files[0])
  }
}

function getFileInputSuccessMessage (file: File | null) {
  return file ? t('global.success.file.loaded') : undefined
}
</script>

<template>
  <div class="create-trace-form-trace-definition-items">
    <div class="create-trace-form-trace-definition-items__fields">
      <div class="create-trace-form-trace-definition-items__field">
        <form.Field name="file">
          <template #default="{ field }">
            <TraceFileUpload
              id="trace-file-upload"
              :model-value="field.state.value"
              :aria-label="`${t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.fileUpload.title')} ${t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.fileUpload.subtitle')}`"
              :error="field.state.meta.errors.join(', ')"
              :valid-message="getFileInputSuccessMessage(field.state.value)"
              @change="(files: FileList) => handleFileChange(files, field.handleChange)"
              @update:model-value="(value: File | null | undefined) => field.handleChange(value ?? null)"
            />
          </template>
        </form.Field>
      </div>

      <div class="create-trace-form-trace-definition-items__field">
        <form.Field name="traceName">
          <template #default="{ field }">
            <TraceNameInput
              id="trace-name"
              :model-value="field.state.value"
              :error-message="field.state.meta.errors.join(', ')"
              required
              @blur="field.handleBlur"
              @update:model-value="(value) => typeof value == 'string' && field.handleChange(value)"
            />
          </template>
        </form.Field>
      </div>

      <div class="create-trace-form-trace-definition-items__field">
        <form.Field name="personalNote">
          <template #default="{ field }">
            <TracePersonalNoteTextarea
              id="personal-note"
              :model-value="field.state.value"
              :error-message="field.state.meta.errors.join(', ')"
              @update:model-value="(value) => typeof value == 'string' && field.handleChange(value)"
              @blur="field.handleBlur"
            />
          </template>
        </form.Field>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.create-trace-form-trace-definition-items {
  padding: var(--spacing-md);
}

.create-trace-form-trace-definition-items__fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.create-trace-form-trace-definition-items__field {
  display: flex;
  flex-direction: column;
}
</style>
