<script lang="ts" setup>
import type { StudentFeedbackItemListDTO } from '@/api/avenir-esr'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { AvButton, type AvSelectOption, type AvSelectSelectedOption, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityFeedbackStudentSelectProps {
  feedbacks: StudentFeedbackItemListDTO[]
  selectedStudentId?: string
}

interface StudentSelectOption extends AvSelectOption {
  feedbackId: string
}

const { feedbacks, selectedStudentId } = defineProps<ActivityFeedbackStudentSelectProps>()

const { t } = useI18n()
const route = useRoute()
const { navigateToStaffStudentTrackingActivityFeedbackDetails, navigateToStaffActivityFeedbackDetails } = useNavigation()

const isStudentTrackingRoute = computed(() => route.name === ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name)

const targetRouteName = computed(() => isStudentTrackingRoute.value
  ? ROUTES.STAFF.STUDENT_TRACKING.ACTIVITY_FEEDBACK.name
  : ROUTES.STAFF.ACTIVITY_FEEDBACK.name)

const options = computed<StudentSelectOption[]>(() =>
  feedbacks
    .filter((feedback): feedback is StudentFeedbackItemListDTO & { feedbackId: string } =>
      Boolean(feedback.feedbackId),
    )
    .map(({ feedbackId, student, status }) => ({
      id: student.id,
      feedbackId,
      label: `${student.firstName} ${student.lastName} • ${t(`staff.feedbacks.badges.feedbackStatus.${status}`)}`,
    })),
)

const selectedOptionValue = computed<AvSelectSelectedOption>(() => ({
  itemId: selectedStudentId ?? '',
}))

const selectedIndex = computed(() =>
  options.value.findIndex(option => option.id === selectedStudentId),
)

const selectedFeedback = computed(() =>
  feedbacks.find(feedback => feedback.student.id === selectedStudentId),
)

const selectedStudentDetails = computed(() => {
  const student = selectedFeedback.value?.student
  return [student?.program?.name, student?.email].filter(Boolean).join(' • ')
})

const prevOption = computed(() => {
  if (selectedIndex.value <= 0) {
    return null
  }
  return options.value[selectedIndex.value - 1]
})

const nextOption = computed(() => {
  if (selectedIndex.value === -1 || selectedIndex.value === options.value.length - 1) {
    return null
  }
  return options.value[selectedIndex.value + 1]
})

function navigateToFeedback (feedbackId: string) {
  return isStudentTrackingRoute.value
    ? navigateToStaffStudentTrackingActivityFeedbackDetails({ feedbackId })
    : navigateToStaffActivityFeedbackDetails({ feedbackId })
}

function onSelectedItemChange (selected: AvSelectSelectedOption) {
  const option = options.value.find(option => option.id === selected.itemId)
  if (option) {
    navigateToFeedback(option.feedbackId)
  }
}
</script>

<template>
  <div class="av-row av-justify-between av-align-center">
    <AvButton
      :label="t('global.buttons.previous')"
      :icon="MDI_ICONS.ARROW_LEFT_THIN"
      :disabled="!prevOption"
      :disabled-tooltip="t('staff.feedbacks.views.ActivityFeedbackDetailsView.ActivityFeedbackStudentSelect.previousDisabledTooltip')"
      variant="OUTLINED"
      small
      data-testid="previous-student-button"
      :to="prevOption ? { name: targetRouteName, params: { feedbackId: prevOption.feedbackId } } : undefined"
    />
    <div class="activity-feedback-student-select av-col av-align-center av-w-full av-gap-xs">
      <div class="activity-feedback-student-select__control av-text-center">
        <AvSelect
          :selected-item="selectedOptionValue"
          :options="options"
          :placeholder="t('staff.feedbacks.views.ActivityFeedbackDetailsView.ActivityFeedbackStudentSelect.placeholder')"
          data-testid="student-feedback-select"
          @update:selected-item="onSelectedItemChange"
        />
      </div>

      <span
        v-if="selectedStudentDetails"
        class="activity-feedback-student-select__details av-text-text2 av-text-center caption-regular"
      >{{ selectedStudentDetails }}</span>
    </div>
    <AvButton
      :label="t('global.buttons.next')"
      :icon="MDI_ICONS.ARROW_RIGHT_THIN"
      variant="OUTLINED"
      :disabled="!nextOption"
      :disabled-tooltip="t('staff.feedbacks.views.ActivityFeedbackDetailsView.ActivityFeedbackStudentSelect.nextDisabledTooltip')"
      small
      data-testid="next-student-button"
      :to="nextOption ? { name: targetRouteName, params: { feedbackId: nextOption.feedbackId } } : undefined"
    />
  </div>
</template>
