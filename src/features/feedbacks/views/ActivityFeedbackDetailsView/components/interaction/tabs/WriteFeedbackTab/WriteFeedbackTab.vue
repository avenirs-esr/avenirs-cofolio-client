<script lang="ts" setup>
import { EUserCategory, type FeedbackDetailsDTO, invalidateGetFeedbackDetails, useSubmitFeedback } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import FeedbackAttachmentsFormField from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackAttachmentsFormField/FeedbackAttachmentsFormField.vue'
import FeedbackFormField from '@/features/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackFormField/FeedbackFormField.vue'
import { useWriteFeedbackForm } from '@/features/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form/use-write-feedback-form'
import { useToasterStore } from '@/store'
import { AvBadge, AvCancelConfirmButtons, MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface WriteFeedbackTabProps {
  feedback: FeedbackDetailsDTO
  readonly?: boolean
}

const { feedback, readonly } = defineProps<WriteFeedbackTabProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'feedbackSent'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const showSavedBadge = ref(false)

const { form, isFormValid, isSubmitting, isDirty, queueAutoSave, handleCancel } = useWriteFeedbackForm({
  feedback: computed(() => feedback),
  onFeedbackSaved: () => {
    showSavedBadge.value = true
  },
  onCancel: () => emit('cancel')
}
)

const { mutate: mutateSubmitFeedback, isPending } = useSubmitFeedback()

function submitFeedback () {
  mutateSubmitFeedback(
    { feedbackId: feedback.id },
    {
      onSuccess: async () => {
        await withTaskLoading(() => invalidateGetFeedbackDetails(queryClient, EUserCategory.STAFF, feedback.id))
        addSuccessMessage(t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.success.sendFeedback'))
        form.reset()
        emit('feedbackSent')
      },
      onError: (error) => {
        addErrorMessage({
          title: t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.errors.saveFeedback'),
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
  <div
    class="av-col av-gap-sm"
    data-testid="write-feedback-tab"
  >
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
    <form
      data-testid="write-feedback-form"
      @submit.prevent="form.handleSubmit"
    >
      <div class="av-col av-gap-md">
        <FeedbackFormField
          :form="form"
          :readonly="readonly"
          data-testid="feedback-form-field"
          @autosave="queueAutoSave"
        />
        <FeedbackAttachmentsFormField
          :form="form"
          :readonly="readonly"
          @autosave="queueAutoSave"
        />
      </div>
    </form>

    <div
      v-memo="[isFormValid, isSubmitting, isDirty, isPending, isLoading]"
      class="av-row av-justify-end av-p-md"
    >
      <AvCancelConfirmButtons
        :cancel-label="t('global.buttons.exit')"
        :confirm-label="t('global.buttons.send')"
        :confirm-icon="MS_ICONS.SEND_OUTLINE_ROUNDED"
        :cancel-is-loading="isPending || isLoading"
        :confirm-is-loading="isDirty || isPending || isSubmitting || isLoading"
        :confirm-disabled="readonly || !isFormValid"
        @cancel="handleCancel"
        @confirm="submitFeedback"
      />
    </div>
  </div>
</template>
