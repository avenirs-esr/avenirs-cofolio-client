<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/traces/types/forms.types'
import TraceFileUpload from '@/features/student/traces/components/interactions/inputs/TraceFileUpload/TraceFileUpload.vue'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceFileUploadFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceFileUploadFormFieldProps>()
const emit = defineEmits<{
  fileSelected: [file: File]
  fileDeleted: [fileName: string]
}>()

const FormField = markRaw(form.Field)

const { t } = useI18n()

const fileField = form.useField({ name: 'file' })

function getFileInputSuccessMessage (file: File | null) {
  return file ? t('global.success.file.loaded') : undefined
}

function handleFilesChange (files: FileList) {
  if (files.length > 0) {
    fileField.api.handleChange(files[0])
    emit('fileSelected', files[0])
  }
}

function handleFileValueChange (file: File | null) {
  const previousFile = fileField.state.value.value

  fileField.api.handleChange(file)

  if (!file && previousFile) {
    emit('fileDeleted', previousFile.name)
  }
}
</script>

<template>
  <FormField name="file">
    <template #default="{ field }">
      <TraceFileUpload
        id="trace-file-upload"
        v-bind="$attrs"
        v-model="field.state.value"
        :error="field.state.meta.errors.join(', ')"
        :valid-message="getFileInputSuccessMessage(field.state.value)"
        @blur="field.handleBlur"
        @change="handleFilesChange"
        @update:model-value="handleFileValueChange"
      />
    </template>
  </FormField>
</template>
