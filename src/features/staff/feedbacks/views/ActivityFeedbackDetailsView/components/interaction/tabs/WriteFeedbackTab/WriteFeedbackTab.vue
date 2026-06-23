<script lang="ts" setup>
import { type FeedbackDetailsDTO, useSubmitFeedback } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import FeedbackFormField from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackFormField/FeedbackFormField.vue'
import { useWriteFeedbackForm } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form/use-write-feedback-form'
import { useToasterStore } from '@/store'
import { AvBadge, AvCancelConfirmButtons, MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface WriteFeedbackTabProps {
  feedback: FeedbackDetailsDTO
}

const { feedback } = defineProps<WriteFeedbackTabProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'feedbackSent'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const showSavedBadge = ref(false)

const { form, isFormValid, isSubmitting, isDirty, handleCancel } = useWriteFeedbackForm(
  feedback,
  () => showSavedBadge.value = true
)

function onCancel () {
  handleCancel()
  emit('cancel')
}

function saveFeedback () {
  form.handleSubmit()
}

const { mutate: mutateSubmitFeedback, isPending } = useSubmitFeedback()

function submitFeedback () {
  mutateSubmitFeedback(
    { feedbackId: feedback.id },
    {
      onSuccess: () => {
        addSuccessMessage(t('staff.feedbacks.views.ActivityFeedbackDetailsView.WriteFeedbackFloatingPanel.tabs.write.success.sendFeedback'))
        emit('feedbackSent')
      },
      onError: (error) => {
        addErrorMessage({
          title: t('staff.feedbacks.views.ActivityFeedbackDetailsView.WriteFeedbackFloatingPanel.tabs.write.errors.saveFeedback'),
          description: getErrorMessage(error)
        })
      },
    }
  )
}

watch(isDirty, (newValue) => {
  if (newValue) {
    showSavedBadge.value = false
  }
})
</script>

<template>
  <div class="av-col av-gap-sm">
    <div
      v-if="showSavedBadge"
      class="av-row av-pr-md av-justify-end"
    >
      <AvBadge
        :label="t('global.saved')"
        :icon="MDI_ICONS.CHECK_CIRCLE_OUTLINE"
        color="var(--other-background-base)"
        background-color="var(--dark-background-primary1)"
      />
    </div>
    <form @submit.prevent="form.handleSubmit">
      <FeedbackFormField
        :form="form"
        @autosave="saveFeedback"
      />
    </form>

    <div
      v-memo="[isFormValid, isSubmitting, isDirty, isPending]"
      class="av-row av-justify-end av-p-md"
    >
      <AvCancelConfirmButtons
        :cancel-label="t('global.buttons.exit')"
        :confirm-label="t('global.buttons.send')"
        :confirm-icon="MS_ICONS.SEND_OUTLINE_ROUNDED"
        :cancel-is-loading="isPending"
        :confirm-is-loading="isDirty || isPending"
        :is-submitting="isSubmitting"
        :is-form-valid="isFormValid"
        @cancel="onCancel"
        @confirm="submitFeedback"
      />
    </div>
  </div>
</template>
