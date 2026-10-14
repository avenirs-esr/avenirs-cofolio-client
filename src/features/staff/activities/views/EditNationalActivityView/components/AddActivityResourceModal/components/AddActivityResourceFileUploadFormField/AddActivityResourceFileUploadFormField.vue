<script setup lang="ts">
import type { AddActivityResourceForm } from '@/features/staff/activities/types/forms.types'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import FileUpload from '@/common/components/interaction/files/FileUpload/FileUpload.vue'
import { bytesToMegabytes } from '@/common/utils/file/file'
import { ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES, ACTIVITY_RESOURCE_MAX_FILE_SIZE } from '@/features/staff/activities/config'

interface AddActivityResourceFileUploadFormFieldProps {
  form: AddActivityResourceForm
}

const { form } = defineProps<AddActivityResourceFileUploadFormFieldProps>()

const emit = defineEmits<{
  fileSelected: [file: File]
  fileDeleted: [fileName: string]
}>()

const { t } = useI18n()
const FormField = markRaw(form.Field)
const fileField = form.useField({ name: 'file' })

const accept = [...ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES]
const maxFileSizeMb = bytesToMegabytes(ACTIVITY_RESOURCE_MAX_FILE_SIZE)

function handleChange (files: FileList | File[]) {
  const list = Array.isArray(files) ? files : Array.from(files)
  if (list.length > 0) {
    emit('fileSelected', list[0])
    fileField.api.handleChange(list[0])
  }
}

function handleModelValueUpdate (file: File[] | null | undefined) {
  const previous = fileField.state.value.value

  const updatedFile = file?.[0] ?? null
  fileField.api.handleChange(updatedFile)
  if (!updatedFile && previous) {
    emit('fileDeleted', previous.name)
  }
}

const formFile = computed(() => fileField.state.value.value ? [fileField.state.value.value] as File[] | null : null)

function getErrorMessage (fieldErrors: (string | undefined)[]): string {
  return fieldErrors.filter(Boolean).map(String).join(' ')
}
</script>

<template>
  <FormField name="file">
    <template #default="{ field }">
      <div
        class="av-col av-gap-xxs"
        data-testid="add-activity-resource-file-upload-container"
      >
        <FileUpload
          :model-value="formFile"
          :accept="accept"
          :max-file-size-mb="maxFileSizeMb"
          :title="t('global.information.FileUpload.title')"
          :aria-label="t('global.information.FileUpload.title')"
          :description="t('global.information.FileUpload.dragAndDrop')"
          :error="getErrorMessage(field.state.meta.errors)"
          data-testid="add-activity-resource-file-upload"
          @blur="field.handleBlur"
          @change="handleChange"
          @update:model-value="handleModelValueUpdate"
        />
        <div
          class="caption-light"
          data-testid="add-activity-resource-file-upload-formats"
        >
          {{ t('global.information.FileUpload.formatsLabel') }}
          <span class="caption-bold">{{ t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.file.formatsValue') }}</span>
          •
          {{ t('global.information.FileUpload.sizeLabel') }}
          <span class="caption-bold">{{ t('global.information.FileUpload.maxMbSize', { size: bytesToMegabytes(ACTIVITY_RESOURCE_MAX_FILE_SIZE) }) }}</span>
        </div>
      </div>
    </template>
  </FormField>
</template>
