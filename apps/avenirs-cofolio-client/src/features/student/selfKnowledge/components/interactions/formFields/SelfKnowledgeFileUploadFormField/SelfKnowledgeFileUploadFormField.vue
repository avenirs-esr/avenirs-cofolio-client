<script setup lang="ts">
import type { FileDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { AddSelfKnowledgeCategoryElementForm, UpdateSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import FileUpload from '@/common/components/interaction/files/FileUpload/FileUpload.vue'
import { bytesToMegabytes, dtoToFile, isFile } from '@/common/utils/file/file'
import { SELF_KNOWLEDGE_ELEMENT_ATTACHMENT_ACCEPTED_FILE_TYPES, SELF_KNOWLEDGE_ELEMENT_ATTACHMENT_MAX_FILE_SIZE } from '@/features/student/selfKnowledge/config'

interface SelfKnowledgeFileUploadFormFieldProps {
  form: AddSelfKnowledgeCategoryElementForm | UpdateSelfKnowledgeCategoryElementForm
}

const { form } = defineProps<SelfKnowledgeFileUploadFormFieldProps>()

const emit = defineEmits<{
  autosave: []
}>()

const { t } = useI18n()

const FormField = markRaw(form.Field)
const fileField = form.useField({ name: 'file' })

const accept = [...SELF_KNOWLEDGE_ELEMENT_ATTACHMENT_ACCEPTED_FILE_TYPES]
const maxFileSizeMb = bytesToMegabytes(SELF_KNOWLEDGE_ELEMENT_ATTACHMENT_MAX_FILE_SIZE)

const isFormDirty = form.useStore(state => state.isDirty)

const files = computed<File[] | null>(() => {
  const current = (fileField.state.value.value ?? []) as (File | FileDTO)[]
  return current.length
    ? current.map(file => (isFile(file) ? file : dtoToFile(file)))
    : null
})

function handleModelValueUpdate (updatedFiles: File[] | null | undefined) {
  const displayedFiles = files.value ?? []
  const sourceFiles = (fileField.state.value.value ?? []) as (File | FileDTO)[]

  const nextValue = (updatedFiles ?? []).map(
    file => sourceFiles[displayedFiles.indexOf(file)] ?? file
  )

  fileField.api.handleChange(nextValue)

  const hasErrors = fileField.state.value.meta.errors.filter(Boolean).length > 0
  if (!hasErrors && isFormDirty.value) {
    emit('autosave')
  }
}

function getErrorMessage (fieldErrors: (string | undefined)[]): string {
  return fieldErrors.filter(Boolean).map(String).join(' ')
}
</script>

<template>
  <FormField name="file">
    <template #default="{ field }">
      <div
        class="av-col av-gap-xxs"
        data-testid="self-knowledge-file-upload-formats"
      >
        <FileUpload
          :model-value="files"
          :accept="accept"
          :max-file-size-mb="maxFileSizeMb"
          :title="t('global.information.FileUpload.title')"
          :aria-label="t('global.information.FileUpload.title')"
          :description="t('global.information.FileUpload.dragAndDrop')"
          :error="getErrorMessage(field.state.meta.errors)"
          enable-multiple
          compact
          @update:model-value="handleModelValueUpdate"
        />
        <div class="caption-light">
          {{ t('global.information.FileUpload.formatsLabel') }}
          <span class="caption-bold">{{ t('student.selfKnowledge.views.SelfKnowledgeCategoryView.attachments.formatsValue') }}</span>
          •
          {{ t('global.information.FileUpload.sizeLabel') }}
          <span class="caption-bold">
            {{ t('global.information.FileUpload.maxMbSize', { size: maxFileSizeMb }) }}
          </span>
        </div>
      </div>
    </template>
  </FormField>
</template>
