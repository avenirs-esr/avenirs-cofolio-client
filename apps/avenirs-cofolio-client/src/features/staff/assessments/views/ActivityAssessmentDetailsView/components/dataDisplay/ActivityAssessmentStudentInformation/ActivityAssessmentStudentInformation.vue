<script lang="ts" setup>
import type { EDeclaredActivityStatus, UserInfoDTO } from '@/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { useDateUtils } from '@/common/composables'
import AssessmentStatusBadge from '@/features/staff/assessments/components/badges/AssessmentStatusBadge/AssessmentStatusBadge.vue'

export interface ActivityAssessmentStudentInformationProps {
  student: UserInfoDTO
  submittedAt: string
  status: EDeclaredActivityStatus
}

const { student, submittedAt, status } = defineProps<ActivityAssessmentStudentInformationProps>()

const { t } = useI18n()
const { formatTranslatedDateTime } = useDateUtils()

const studentFullName = computed(() => `${student.firstName} ${student.lastName}`)

const submissionDetails = computed(() => [
  t('staff.assessments.views.ActivityAssessmentDetailsView.ActivityAssessmentStudentInformation.submittedAt', {
    date: formatTranslatedDateTime(submittedAt),
  }),
  student.email,
].filter(Boolean).join(' • '))
</script>

<template>
  <div
    class="av-col av-align-center av-gap-xs av-text-center"
    data-testid="activity-assessment-student-information"
  >
    <div class="av-row av-align-center av-justify-center av-gap-sm av-wrap">
      <span
        class="b1-bold av-text-text1"
        data-testid="activity-assessment-student-name"
      >{{ studentFullName }}</span>
      <AssessmentStatusBadge :assessment-status="status" />
    </div>
    <span
      class="av-text-text2 caption-regular"
      data-testid="activity-assessment-submission-details"
    >{{ submissionDetails }}</span>
  </div>
</template>
