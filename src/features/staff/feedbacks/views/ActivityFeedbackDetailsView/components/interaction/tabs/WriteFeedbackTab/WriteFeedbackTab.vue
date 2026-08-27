<script lang="ts" setup>
import { EFeedbackStatus, EUserCategory, type FeedbackDetailsDTO, invalidateGetFeedbackDetails, useSubmitFeedback } from '@/api/avenir-esr'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import FeedbackAttachmentsFormField from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackAttachmentsFormField/FeedbackAttachmentsFormField.vue'
import FeedbackFormField from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/components/interaction/formFields/FeedbackFormField/FeedbackFormField.vue'
import { useWriteFeedbackForm } from '@/features/staff/feedbacks/views/ActivityFeedbackDetailsView/composables/use-write-feedback-form/use-write-feedback-form'
import { useToasterStore } from '@/store'
import { AvBadge, AvCancelConfirmButtons, MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface WriteFeedbackTabProps {
  feedback: FeedbackDetailsDTO
}

const { feedback } = defineProps<WriteFeedbackTabProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'feedbackSaved'): void
  (e: 'feedbackSent'): void
}>()

const { t } = useI18n()
const { getErrorMessage } = useApiErrors()
const { addErrorMessage, addSuccessMessage } = useToasterStore()
const queryClient = useQueryClient()
const { isLoading, withTaskLoading } = useTaskLoading()

const isSubmitted = computed(() => feedback.status === EFeedbackStatus.SUBMITTED)
const isSeen = computed(() => feedback.status === EFeedbackStatus.SEEN)

const showSavedBadge = ref<boolean>(false)

const { form, isFormValid, isDirty, isSaving, queueAutoSave, handleCancel } = useWriteFeedbackForm({
  feedback: computed(() => feedback),
  onFeedbackSaved: () => {
    showSavedBadge.value = true
    emit('feedbackSaved')
  },
  onCancel: () => emit('cancel')
})

const { mutate: mutateSubmitFeedback, isPending } = useSubmitFeedback()

const autosave = computed(() => isSubmitted.value || isSeen.value ? undefined : queueAutoSave)

async function handleConfirm () {
  if (isSubmitted.value) {
    form.handleSubmit()
    return
  }

  mutateSubmitFeedback({ feedbackId: feedback.id }, {
    onSuccess: async () => {
      await withTaskLoading(() => invalidateGetFeedbackDetails(queryClient, EUserCategory.STAFF, feedback.id))
      addSuccessMessage(t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.success.sendFeedback'))
      form.reset()
      emit('feedbackSent')
    },
    onError: (error) => {
      addErrorMessage({
        title: t('staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.errors.sendFeedback'),
        description: getErrorMessage(error)
      })
    }
  })
}

const confirmLabel = computed(() => t(
  isSubmitted.value || isSeen.value
    ? 'staff.feedbacks.views.ActivityFeedbackDetailsView.FeedbackManagementFloatingPanel.tabs.write.inputs.updateLabel'
    : 'global.buttons.send'
))

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
          :readonly="isSeen"
          data-testid="feedback-form-field"
          @autosave="autosave"
        />
        <FeedbackAttachmentsFormField
          :form="form"
          :readonly="isSeen"
          @autosave="autosave"
        />
      </div>
    </form>

    <div
      v-memo="[isFormValid, isDirty, isSaving, isPending, isLoading]"
      class="av-row av-justify-end av-p-md"
    >
      <AvCancelConfirmButtons
        :cancel-label="t('global.buttons.exit')"
        :confirm-label="confirmLabel"
        :confirm-icon="MS_ICONS.SEND_OUTLINE_ROUNDED"
        :cancel-is-loading="isSaving || isPending || isLoading"
        :confirm-is-loading="(!isSubmitted && isDirty) || isSaving || isPending || isLoading"
        :confirm-disabled="isSeen || !isFormValid"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      />
    </div>
  </div>
</template>
