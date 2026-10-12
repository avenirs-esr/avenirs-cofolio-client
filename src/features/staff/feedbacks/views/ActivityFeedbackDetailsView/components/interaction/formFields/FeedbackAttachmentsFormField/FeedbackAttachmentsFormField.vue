<script setup lang="ts">
import type { WriteFeedbackForm } from '@/features/staff/feedbacks/types/forms.types'
import FileUpload from '@/common/components/interaction/files/FileUpload/FileUpload.vue'
import { bytesToMegabytes, dtoToFile, isFile } from '@/common/utils/file/file'
import {
  FEEDBACK_ATTACHMENT_ACCEPTED_FILE_TYPES,
  FEEDBACK_ATTACHMENT_MAX_FILE_SIZE
} from '@/features/staff/feedbacks/config'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

interface FeedbackAttachmentsFormFieldProps {
  form: WriteFeedbackForm
  readonly?: boolean
}

const { form, readonly } = defineProps<FeedbackAttachmentsFormFieldProps>()

const emit = defineEmits<{
  autosave: []
}>()

const { t } = useI18n()

const FormField = markRaw(form.Field)
const attachmentsField = form.useField({ name: 'attachments' })

const accept = [...FEEDBACK_ATTACHMENT_ACCEPTED_FILE_TYPES]
const maxFileSizeMb = bytesToMegabytes(FEEDBACK_ATTACHMENT_MAX_FILE_SIZE)

const isFormDirty = form.useStore(state => state.isDirty)

const files = computed<File[] | null>(() => {
  const attachments = attachmentsField.state.value.value ?? []
  return attachments.length ? attachments.map(attachment => isFile(attachment) ? attachment : dtoToFile(attachment)) : null
})

function handleModelValueUpdate (updatedFiles: File[] | null | undefined) {
  const displayedFiles = files.value ?? []
  const attachments = attachmentsField.state.value.value ?? []

  attachmentsField.api.handleChange(
    (updatedFiles ?? []).map(file => attachments[displayedFiles.indexOf(file)] ?? file)
  )

  const hasErrors = attachmentsField.state.value.meta.errors.filter(Boolean).length > 0
  if (!hasErrors && isFormDirty.value) {
    emit('autosave')
  }
}

function getErrorMessage (fieldErrors: (string | undefined)[]): string {
  return fieldErrors.filter(Boolean).map(String).join(' ')
}
</script>

<template>
  <FormField name="attachments">
    <template #default="{ field }">
      <div
        class="av-col av-gap-xxs"
        data-testid="feedback-attachments-form-field"
      >
        <FileUpload
          :model-value="files"
          :accept="accept"
          :max-file-size-mb="maxFileSizeMb"
          :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.attachments.title')"
          :aria-label="t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.attachments.title')"
          :description="t('global.information.FileUpload.dragAndDrop')"
          :disabled="readonly"
          :error="getErrorMessage(field.state.meta.errors)"
          enable-multiple
          compact
          @update:model-value="handleModelValueUpdate"
        />
        <div class="caption-light">
          {{ t('global.information.FileUpload.formatsLabel') }}
          <span class="caption-bold">{{ t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.attachments.formatsValue') }}</span>
          •
          {{ t('global.information.FileUpload.sizeLabel') }}
          <span class="caption-bold">{{ t('global.information.FileUpload.maxMbSize', { size: maxFileSizeMb }) }}</span>
        </div>
      </div>
    </template>
  </FormField>
</template>
