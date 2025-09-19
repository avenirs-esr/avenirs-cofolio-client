<script setup lang="ts">
import type {
  CreateTraceForm
} from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { TRACE_ACCEPTED_FILE_TYPES } from '@/features/student/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types'
import { AvFileUpload, AvInput, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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

const filesTypesMaxSize = [
  { type: 'global.images', size: '5Mo' },
  { type: 'global.text', size: '5Mo' },
  { type: 'global.audio', size: '5Mo' },
  { type: 'global.video', size: '10Mo' },
  { type: 'global.application', size: '10Mo' }
]

const acceptedFileTypes = [...TRACE_ACCEPTED_FILE_TYPES]

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
            <AvFileUpload
              id="trace-file-upload"
              :title="t('global.information.fileUpload.title')"
              :description="t('global.information.fileUpload.dragAndDrop')"
              :delete-button-label="t('global.buttons.delete')"
              :model-value="field.state.value"
              :accept="acceptedFileTypes"
              :aria-label="`${t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.fileUpload.title')} ${t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.fileUpload.subtitle')}`"
              :error="field.state.meta.errors.join(', ')"
              :valid-message="getFileInputSuccessMessage(field.state.value)"
              @change="(files) => handleFileChange(files, field.handleChange)"
              @update:model-value="(value) => field.handleChange(value)"
            />
          </template>
        </form.Field>
        <div>
          <span
            v-for="(item, index) in filesTypesMaxSize"
            :key="item.type"
            class="caption-light"
          >
            {{ $t(item.type) }} : <span class="caption-bold">{{ item.size }}</span>
            <span v-if="index < filesTypesMaxSize.length - 1"> • </span>
          </span>
        </div>
      </div>

      <div class="create-trace-form-trace-definition-items__field">
        <form.Field name="traceName">
          <template #default="{ field }">
            <AvInput
              id="trace-name"
              :model-value="field.state.value"
              :label="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.traceName.label')"
              :placeholder="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.traceName.placeholder')"
              :error-message="field.state.meta.errors.join(', ')"
              required
              :prefix-icon="MDI_ICONS.ATTACH_FILE"
              @blur="field.handleBlur"
              @update:model-value="(value) => typeof value == 'string' && field.handleChange(value)"
            />
          </template>
        </form.Field>
      </div>

      <div class="create-trace-form-trace-definition-items__field">
        <form.Field name="personalNote">
          <template #default="{ field }">
            <AvInput
              id="personal-note"
              :model-value="field.state.value"
              :label="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.personalNote.label')"
              :maxlength="200"
              :placeholder="t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.personalNote.placeholder')"
              :error-message="field.state.meta.errors.join(', ')"
              is-textarea
              @update:model-value="(value) => typeof value == 'string' && field.handleChange(value)"
              @blur="field.handleBlur"
            >
              <template #customCaptions="{ currentValue, maxlength }">
                <span class="caption-light">
                  {{ $t('student.views.studentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.personalNote.hint', {
                    count: currentValue?.toString().length,
                    maxlength,
                  }) }}
                </span>
              </template>
            </AvInput>
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
