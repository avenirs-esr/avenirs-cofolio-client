<script setup lang="ts">
import type { CreateTraceForm, UpdateTraceForm } from '@/features/student/traces'
import TraceFileUpload from '@/features/student/traces/components/interactions/inputs/TraceFileUpload/TraceFileUpload.vue'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceFileUploadFormFieldProps {
  form: CreateTraceForm | UpdateTraceForm
}

const { form } = defineProps<TraceFileUploadFormFieldProps>()
const FormField = markRaw(form.Field)

const { t } = useI18n()

const fileField = form.useField({ name: 'file' })

function getFileInputSuccessMessage (file: File | null) {
  return file ? t('global.success.file.loaded') : undefined
}

function handleFilesChange (files: FileList) {
  if (files.length > 0) {
    fileField.api.handleChange(files[0])
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
        @update:model-value="(value: File | null) => field.handleChange(value)"
      />
    </template>
  </FormField>
</template>

<style scoped lang="scss">

</style>
