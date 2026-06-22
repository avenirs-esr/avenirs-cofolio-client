<script setup lang="ts">
import { EFeedbackStatus } from '@/api/avenir-esr'
import { AvTagPicker, type AvTagPickerOption } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackStatusPickerProps {
  totalFeedbacks: number
  newFeedbacks: number
  unprocessedFeedbacks: number
  sentFeedbacks: number
}

const {
  totalFeedbacks,
  newFeedbacks,
  unprocessedFeedbacks,
  sentFeedbacks,
} = defineProps<FeedbackStatusPickerProps>()

const emit = defineEmits<{
  (event: 'select', selected: AvTagPickerOption): void
}>()

function handleSelectChange (selected: AvTagPickerOption): void {
  emit('select', selected)
}

const { t } = useI18n()

const allStatusOption = computed<AvTagPickerOption>(() => ({
  label: t('staff.feedbacks.views.FeedbacksView.FeedbackStatusPicker.all', { count: totalFeedbacks }),
  value: 'ALL'
}))

const filterOptions = computed<AvTagPickerOption[]>(() => [
  allStatusOption.value,
  {
    label: t('staff.feedbacks.views.FeedbacksView.FeedbackStatusPicker.new', { count: newFeedbacks }),
    value: EFeedbackStatus.NEW
  },
  {
    label: t('staff.feedbacks.views.FeedbacksView.FeedbackStatusPicker.unprocessed', { count: unprocessedFeedbacks }),
    value: EFeedbackStatus.IN_PROCESS
  },
  {
    label: t('staff.feedbacks.views.FeedbacksView.FeedbackStatusPicker.sent', { count: sentFeedbacks }),
    value: EFeedbackStatus.SUBMITTED
  }
])
</script>

<template>
  <AvTagPicker
    data-testid="feedback-status-picker"
    class="av-w-full av-wrap"
    :options="filterOptions"
    :selected="allStatusOption"
    :handle-select-change="handleSelectChange"
  />
</template>
