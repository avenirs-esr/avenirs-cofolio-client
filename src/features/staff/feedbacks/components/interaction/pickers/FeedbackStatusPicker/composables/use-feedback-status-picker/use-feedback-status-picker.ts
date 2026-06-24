import type { EFeedbackStatus } from '@/api/avenir-esr'
import type { AvTagPickerOption } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef, MaybeRef, Ref } from 'vue'
import { useGetFeedbackDashboard } from '@/api/avenir-esr'
import { isNumber } from 'lodash-es'
import { unref } from 'vue'

interface UseFeedbackStatusPickerOptions {
  activityId?: MaybeRef<string | undefined>
  onReset?: () => void
}

export interface UseFeedbackStatusPickerReturn {
  newFeedbacks: ComputedRef<number>
  unprocessedFeedbacks: ComputedRef<number>
  sentFeedbacks: ComputedRef<number>
  totalFeedbacks: ComputedRef<number>
  selectedStatus: Ref<'ALL' | EFeedbackStatus>
  onStatusSelected: (option: AvTagPickerOption) => void
}

export function useFeedbackStatusPicker (options?: UseFeedbackStatusPickerOptions): UseFeedbackStatusPickerReturn {
  const { activityId, onReset } = options ?? {}

  const { data: feedbackDashboard } = useGetFeedbackDashboard(
    activityId !== undefined
      ? computed(() => ({ activityId: unref(activityId) }))
      : undefined
  )

  const newFeedbacks = computed(() => feedbackDashboard.value?.newFeedbacks ?? 0)
  const unprocessedFeedbacks = computed(() =>
    isNumber(feedbackDashboard.value?.pendingFeedbacks) && isNumber(feedbackDashboard.value?.newFeedbacks)
      ? feedbackDashboard.value.pendingFeedbacks - feedbackDashboard.value.newFeedbacks
      : 0
  )
  const sentFeedbacks = computed(() => feedbackDashboard.value?.processedFeedbacks ?? 0)
  const totalFeedbacks = computed(() => feedbackDashboard.value?.totalFeedbacks ?? 0)

  const selectedStatus = ref<'ALL' | EFeedbackStatus>('ALL')

  function onStatusSelected (option: AvTagPickerOption): void {
    selectedStatus.value = option.value as 'ALL' | EFeedbackStatus
    onReset?.()
  }

  return {
    newFeedbacks,
    unprocessedFeedbacks,
    sentFeedbacks,
    totalFeedbacks,
    selectedStatus,
    onStatusSelected,
  }
}
