<script lang="ts" setup>
import type { StudentFeedbackItemListDTO } from '@/api/avenir-esr'
import type { AvSelectOption, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
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

const selectedStudentEmail = computed(() =>
  selectedFeedback.value?.student.email ?? '',
)
</script>

<template>
  <div class="activity-feedback-student-select av-col av-align-center av-w-full">
    <div class="activity-feedback-student-select__control av-text-center">
      <AvSelect
        v-model:selected-item="selectedStudent"
        :options="options"
        :placeholder="t('staff.feedbacks.views.ActivityFeedbackDetailsView.ActivityFeedbackStudentSelect.placeholder')"
        data-testid="student-feedback-select"
      />
    </div>

    <div
      v-if="selectedFeedback"
      class="activity-feedback-student-select__details av-col av-align-center av-text-center"
    >
      <span
        v-if="selectedStudentEmail"
        class="av-text-text2 caption-regular"
      >{{ selectedStudentEmail }}</span>
    </div>
  </div>
</template>
