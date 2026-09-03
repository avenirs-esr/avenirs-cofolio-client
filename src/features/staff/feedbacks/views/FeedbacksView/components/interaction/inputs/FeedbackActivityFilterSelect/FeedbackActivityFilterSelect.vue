<script setup lang="ts">
import { type ActivityItemNavigationDTO, type EFeedbackStatus, useGetActivitiesWithFeedbacks } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { AvSelect, type AvSelectProps, type AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface FeedbackActivityFilterSelectProps extends Omit<AvSelectProps, 'options' | 'placeholder'> {
  feedbackStatuses?: EFeedbackStatus[]
}

const {
  label,
  feedbackStatuses,
  disabled,
  ...restProps
} = defineProps<FeedbackActivityFilterSelectProps>()

const emit = defineEmits<{
  (event: 'change', activity?: ActivityItemNavigationDTO): void
}>()

const { t } = useI18n()

const defaultOptionId = 'ALL'
const selectedItem = ref<AvSelectSelectedOption>({ itemId: defaultOptionId })

function reset () {
  selectedItem.value = { itemId: defaultOptionId }
}

defineExpose({ reset })

const { data, isPending, error } = useGetActivitiesWithFeedbacks({
  statuses: feedbackStatuses
}, {
  query: {
    select: response => response.data
  }
})

const options = computed(() => [
  {
    id: defaultOptionId,
    label: t('staff.feedbacks.views.FeedbacksView.FeedbackActivityFilterSelect.defaultOption')
  },
  ...(data.value ?? []).map(activity => ({
    id: activity.id,
    label: activity.title
  }))
])

const selectedActivity = computed(() => selectedItem.value.itemId === defaultOptionId ? undefined : data.value?.find(activity => activity.id === selectedItem.value.itemId))

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: label ?? t('staff.feedbacks.views.FeedbacksView.FeedbackActivityFilterSelect.label'),
  placeholder: t('staff.feedbacks.views.FeedbacksView.FeedbackActivityFilterSelect.placeholder'),
  options: options.value,
  disabled: !data.value?.length || disabled
}))

watch(selectedActivity, (activity) => {
  emit('change', activity)
})
</script>

<template>
  <QuerySuspense
    :is-loading="isPending"
    :error="error"
  >
    <AvSelect
      v-bind="avSelectProps"
      v-model:selected-item="selectedItem"
      data-testid="feedback-activity-filter-select"
    />
  </QuerySuspense>
</template>
