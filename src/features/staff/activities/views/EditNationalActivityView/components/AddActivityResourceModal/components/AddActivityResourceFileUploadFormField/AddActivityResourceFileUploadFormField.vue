<script setup lang="ts">
import type { AddActivityResourceForm } from '@/features/staff/activities/types/forms.types'
import { ACTIVITY_RESOURCE_ACCEPTED_FILE_TYPES } from '@/features/staff/activities/config'
import { AvFileUpload } from '@avenirs-esr/avenirs-dsav'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

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

function handleChange (files: FileList | File[]) {
  const list = Array.isArray(files) ? files : Array.from(files)
  if (list.length > 0) {
    fileField.api.handleChange(list[0])
    emit('fileSelected', list[0])
  }
}

function handleModelValueUpdate (file: File | null) {
  const previous = fileField.state.value.value
  fileField.api.handleChange(file)
  if (!file && previous) {
    emit('fileDeleted', previous.name)
  }
}
</script>

<template>
  <FormField name="file">
    <template #default="{ field }">
      <div class="av-col av-gap-xxs">
        <AvFileUpload
          :model-value="field.state.value"
          :accept="accept"
          :title="t('global.information.fileUpload.title')"
          :aria-label="t('global.information.fileUpload.title')"
          :description="t('global.information.fileUpload.dragAndDrop')"
          :delete-button-label="t('global.buttons.delete')"
          :error="field.state.meta.errors.filter(Boolean).join(', ')"
          data-testid="add-activity-resource-file-upload"
          @blur="field.handleBlur"
          @change="handleChange"
          @update:model-value="handleModelValueUpdate"
        />
        <div class="caption-light">
          {{ t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.file.formatsLabel') }}
          <span class="caption-bold">{{ t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.file.formatsValue') }}</span>
          •
          {{ t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.file.sizeLabel') }}
          <span class="caption-bold">{{ t('staff.activities.views.EditNationalActivityView.AddActivityResourceModal.file.sizeValue') }}</span>
        </div>
      </div>
    </template>
  </FormField>
</template>
