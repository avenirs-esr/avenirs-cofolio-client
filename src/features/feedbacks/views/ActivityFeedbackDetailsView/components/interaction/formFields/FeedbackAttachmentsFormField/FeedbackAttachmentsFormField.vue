<script setup lang="ts">
import type { WriteFeedbackForm } from '@/features/feedbacks/types/forms.types'
import { bytesToMegabytes, dtoToFile, isFile } from '@/common/utils/file/file'
import {
  FEEDBACK_ATTACHMENT_ACCEPTED_FILE_TYPES,
  FEEDBACK_ATTACHMENT_MAX_FILE_SIZE
} from '@/features/feedbacks/config'
import { AvFileUpload } from '@avenirs-esr/avenirs-dsav'
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

const rejectionError = ref('')
const isFormDirty = form.useStore(state => state.isDirty)

const files = computed<File[] | null>(() => {
  const attachments = attachmentsField.state.value.value ?? []
  return attachments.length ? attachments.map(attachment => isFile(attachment) ? attachment : dtoToFile(attachment)) : null
})

function handleModelValueUpdate (updatedFiles: File[] | null) {
  const displayedFiles = files.value ?? []
  const attachments = attachmentsField.state.value.value ?? []

  rejectionError.value = ''
  attachmentsField.api.handleChange(
    (updatedFiles ?? []).map(file => attachments[displayedFiles.indexOf(file)] ?? file)
  )

  const hasErrors = attachmentsField.state.value.meta.errors.filter(Boolean).length > 0
  if (!hasErrors && isFormDirty.value) {
    emit('autosave')
  }
}

function getErrorMessage (fieldErrors: (string | undefined)[]): string {
  return [...fieldErrors.filter(Boolean).map(String), rejectionError.value].filter(Boolean).join(' ')
}
</script>

<template>
  <FormField name="attachments">
    <template #default="{ field }">
      <div
        class="av-col av-gap-xxs"
        data-testid="feedback-attachments-form-field"
      >
        <AvFileUpload
          :model-value="files"
          :accept="accept"
          :max-file-size-mb="maxFileSizeMb"
          :title="t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.attachments.title')"
          :aria-label="t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.attachments.title')"
          :description="t('global.information.fileUpload.dragAndDrop')"
          :delete-button-label="t('global.buttons.delete')"
          :disabled="readonly"
          :error="getErrorMessage(field.state.meta.errors)"
          enable-multiple
          compact
          @update:model-value="handleModelValueUpdate"
          @accept-type-error="rejectionError = t('global.error.file.acceptType')"
          @file-size-error="rejectionError = t('global.error.file.size')"
        />
        <div class="caption-light">
          {{ t('global.information.fileUpload.formatsLabel') }}
          <span class="caption-bold">{{ t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.attachments.formatsValue') }}</span>
          •
          {{ t('global.information.fileUpload.sizeLabel') }}
          <span class="caption-bold">{{ t('global.information.fileUpload.maxMbSize', { size: maxFileSizeMb }) }}</span>
        </div>
      </div>
    </template>
  </FormField>
</template>
