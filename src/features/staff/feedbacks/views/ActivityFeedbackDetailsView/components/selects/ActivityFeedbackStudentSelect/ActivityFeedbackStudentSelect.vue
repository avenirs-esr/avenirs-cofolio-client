<script lang="ts" setup>
import type { StudentFeedbackItemListDTO } from '@/api/avenir-esr'
import { AvButton, type AvSelectOption, type AvSelectSelectedOption, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityFeedbackStudentSelectProps {
  feedbacks: StudentFeedbackItemListDTO[]
}

const {
  feedbacks,
} = defineProps<ActivityFeedbackStudentSelectProps>()

const { t } = useI18n()

const selectedStudent = defineModel<AvSelectSelectedOption>('selectedStudent', {
  default: () => ({ itemId: '' }),
})

const options = computed<AvSelectOption[]>(() =>
  feedbacks
    .filter((feedback): feedback is StudentFeedbackItemListDTO & { feedbackId: string } =>
      Boolean(feedback.feedbackId),
    )
    .map(({ feedbackId, student }) => ({
      id: feedbackId,
      label: `${student.firstName} ${student.lastName}`,
    })),
)

const selectedFeedback = computed(() =>
  feedbacks.find(feedback => feedback.feedbackId === selectedStudent.value.itemId),
)

const selectedStudentDetails = computed(() => {
  const student = selectedFeedback.value?.student
  return [student?.program?.name, student?.email].filter(Boolean).join(' • ')
})

const prevOption = computed(() => {
  const currentIndex = options.value.findIndex(option => option.id === selectedStudent.value.itemId)
  if (currentIndex <= 0) {
    return null
  }
  return options.value[currentIndex - 1]
})

const nextOption = computed(() => {
  const currentIndex = options.value.findIndex(option => option.id === selectedStudent.value.itemId)
  if (currentIndex === -1 || currentIndex === options.value.length - 1) {
    return null
  }
  return options.value[currentIndex + 1]
})
</script>

<template>
  <div class="av-row av-justify-between av-align-center">
    <AvButton
      :label="t('global.buttons.previous')"
      :icon="MDI_ICONS.ARROW_LEFT_THIN"
      :disabled="!prevOption"
      variant="OUTLINED"
      small
      data-testid="previous-student-button"
      @click="() => selectedStudent.itemId = prevOption!.id"
    />
    <div class="activity-feedback-student-select av-col av-align-center av-w-full av-gap-xs">
      <div class="activity-feedback-student-select__control av-text-center">
        <AvSelect
          v-model:selected-item="selectedStudent"
          :options="options"
          :placeholder="t('staff.feedbacks.views.ActivityFeedbackDetailsView.ActivityFeedbackStudentSelect.placeholder')"
          data-testid="student-feedback-select"
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
      small
      data-testid="next-student-button"
      @click="() => selectedStudent.itemId = nextOption!.id"
    />
  </div>
</template>
