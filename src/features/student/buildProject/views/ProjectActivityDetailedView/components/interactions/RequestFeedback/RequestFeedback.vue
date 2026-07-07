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

const requestFeedbackConfig = computed(() => ({
  label: feedbackStatus === EFeedbackStatus.NEW
    ? t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackButton.updateFeedbackLabel', { date: feedbackCreatedAt ? formatDateLocalized(feedbackCreatedAt, locale.value as AvLocale) : '' })
    : t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackButton.requestFeedbackLabel'),

  icon: feedbackStatus === EFeedbackStatus.NEW ? MS_ICONS.CYCLE_ROUNDED : MS_ICONS.SEND_OUTLINE_ROUNDED,

  variant: (feedbackStatus === EFeedbackStatus.NEW ? 'FLAT' : 'OUTLINED') as AvButtonProps['variant'],
}))

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
      data-testid="request-feedback-button"
      v-bind="requestFeedbackConfig"
      :disabled="disabled"
      :is-loading="isLoading"
      @click="displayModal"
    />
  </div>
  <ConfirmationModal
    :show="showModal"
    data-testid="request-feedback-confirm-modal"
    :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackConfirmModal.title')"
    :description="t('student.buildProject.activities.views.ProjectActivityDetailedView.requestFeedbackActivity.requestFeedbackConfirmModal.description', { count: remainingFeedbacks })"
    :is-loading="isLoading"
    @close="hideModal"
    @confirm="handleConfirm"
  />
</template>
