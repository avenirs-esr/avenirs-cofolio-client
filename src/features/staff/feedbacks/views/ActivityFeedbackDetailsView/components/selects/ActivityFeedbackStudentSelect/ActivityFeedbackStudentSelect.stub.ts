import type { StudentFeedbackItemListDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityFeedbackStudentSelectStub = defineComponent({
  name: 'ActivityFeedbackStudentSelect',
  template: '<div data-testid="activity-feedback-student-select-stub"></div>',
  props: {
    feedbacks: {
      type: Array as PropType<StudentFeedbackItemListDTO[]>,
      required: true,
    },
  },
})
