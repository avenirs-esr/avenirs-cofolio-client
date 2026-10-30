import type { PropType } from 'vue'
import type { EActivityAssessmentStatus, UserInfoDTO } from '@/api/avenir-esr'

export const ActivityAssessmentStudentInformationStub = defineComponent({
  name: 'ActivityAssessmentStudentInformation',
  props: {
    student: {
      type: Object as PropType<UserInfoDTO>,
      required: true,
    },
    submittedAt: {
      type: String,
      required: true,
    },
    status: {
      type: String as PropType<EActivityAssessmentStatus>,
      required: true,
    },
  },
  template: '<div data-testid="activity-assessment-student-information-stub"></div>',
})
