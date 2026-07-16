<script setup lang="ts">
import type { AvLocale } from '@/types/i18n.types'
import { EFeedbackStatus } from '@/api/avenir-esr'
import { ConfirmationModal } from '@/common/components'
import { useModal } from '@/common/composables'
import { formatDateLocalized } from '@/common/utils'
import { AvButton, type AvButtonProps, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface RequestFeedbackProps {
  disabled?: boolean
  isLoading?: boolean
  feedbackStatus?: EFeedbackStatus
  feedbackCreatedAt?: string
  remainingFeedbacks: number
}

const { disabled, isLoading, feedbackStatus, feedbackCreatedAt, remainingFeedbacks } = defineProps<RequestFeedbackProps>()

const emit = defineEmits<{ (e: 'requestFeedback'): void }>()

const { t, locale } = useI18n()
const { showModal, displayModal, hideModal } = useModal()

const hasExistingFeedbackRequest = computed(() =>
  feedbackStatus === EFeedbackStatus.NEW || feedbackStatus === EFeedbackStatus.IN_PROCESS,
)

const isRequestFeedbackButtonDisabled = computed(() =>
  disabled || feedbackStatus === EFeedbackStatus.IN_PROCESS,
)

const requestFeedbackConfig = computed(() => ({
  label: hasExistingFeedbackRequest.value
    ? t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackButton.updateFeedbackLabel', { date: feedbackCreatedAt ? formatDateLocalized(feedbackCreatedAt, locale.value as AvLocale) : '' })
    : t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackButton.requestFeedbackLabel'),

  icon: hasExistingFeedbackRequest.value ? MS_ICONS.CYCLE_ROUNDED : MS_ICONS.SEND_OUTLINE_ROUNDED,

  variant: (hasExistingFeedbackRequest.value ? 'FLAT' : 'OUTLINED') as AvButtonProps['variant'],
}))

const requestFeedbackButtonTestId = computed(() =>
  hasExistingFeedbackRequest.value ? 'update-feedback-button' : 'request-feedback-button',
)
const feedbackDescription = computed(() => {
  if (remainingFeedbacks === -1) {
    return t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackConfirmModal.descriptionUnlimited')
  }
  return t(
    'student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackConfirmModal.description',
    { count: remainingFeedbacks },
  )
})

function handleConfirm () {
  hideModal()
  emit('requestFeedback')
}
</script>

<template>
  <div
    class="av-col av-align-end av-items-end av-pt-md"
    data-testid="request-feedback"
  >
    <AvButton
      :data-testid="requestFeedbackButtonTestId"
      v-bind="requestFeedbackConfig"
      :disabled="isRequestFeedbackButtonDisabled"
      :is-loading="isLoading"
      @click="displayModal"
    />
  </div>
  <ConfirmationModal
    :show="showModal"
    data-testid="request-feedback-confirm-modal"
    :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackConfirmModal.title')"
    :description="feedbackDescription"
    :is-loading="isLoading"
    @close="hideModal"
    @confirm="handleConfirm"
  />
</template>
