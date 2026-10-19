<script setup lang="ts">
import type { AvSelectProps, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import type { ActivityFeedbacksPreviewDTO, EFeedbackStatus } from '@/api/avenir-esr'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { until, watchIgnorable } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useGetActivitiesWithFeedbacks } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'

export interface FeedbackActivityFilterSelectProps extends Omit<AvSelectProps, 'options' | 'placeholder' | 'label'> {
  defaultActivityId?: string
  feedbackStatuses?: EFeedbackStatus[]
}

const {
  defaultActivityId,
  feedbackStatuses,
  disabled,
  labelVisible = true,
  ...restProps
} = defineProps<FeedbackActivityFilterSelectProps>()

const emit = defineEmits<{
  (event: 'change', activity?: ActivityFeedbacksPreviewDTO): void
}>()

const { t } = useI18n()

const defaultOptionValue = 'ALL'
const defaultOption = ref<AvSelectSelectedOption>()
const selectedOption = ref<AvSelectSelectedOption | null>(null)

const { data, isPending, error } = useGetActivitiesWithFeedbacks({ statuses: feedbackStatuses }, {
  query: {
    select: response => response.data,
  },
},)

const options = computed(() => [
  {
    value: defaultOptionValue,
    label: t('staff.feedbacks.views.FeedbacksView.FeedbackActivityFilterSelect.defaultOption'),
  },
  ...(data.value ?? []).map(activity => ({
    value: activity.id,
    label: activity.title,
  })),
])

const selectedActivity = computed(() => {
  const selectedValue = selectedOption.value?.value

  if (!selectedValue || selectedValue === defaultOptionValue) {
    return undefined
  }

  return data.value?.find(activity => activity.id === selectedValue)
})

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: t('staff.feedbacks.views.FeedbacksView.FeedbackActivityFilterSelect.label'),
  placeholder: t('staff.feedbacks.views.FeedbacksView.FeedbackActivityFilterSelect.placeholder'),
  options: options.value,
  disabled: !data.value?.length || disabled,
  labelVisible,
  required: true,
  width: '100%'
}))

function reset () {
  selectedOption.value = defaultOption.value ?? null
}

defineExpose({ reset })

const { ignoreUpdates } = watchIgnorable(selectedActivity, (activity) => {
  emit('change', activity)
})

until(isPending).toBe(false).then(() => {
  const activity = defaultActivityId ? data.value?.find(({ id }) => id === defaultActivityId) : undefined

  const option: AvSelectSelectedOption = {
    value: activity?.id ?? defaultOptionValue,
    label: activity?.title ?? t('staff.feedbacks.views.FeedbacksView.FeedbackActivityFilterSelect.defaultOption'),
  }

  defaultOption.value = option

  ignoreUpdates(() => selectedOption.value = option)

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
      :model-value="selectedOption"
      data-testid="feedback-activity-filter-select"
      @update:model-value="(selectedOption = $event as AvSelectSelectedOption | null)"
    />
  </QuerySuspense>
</template>
