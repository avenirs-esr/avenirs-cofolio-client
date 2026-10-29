import type { PropType } from 'vue'
import type { ReceivedAssessmentDTO } from '@/api/avenir-esr'

export const ReceivedAssessmentSectionStub = defineComponent({
  name: 'ReceivedAssessmentSection',
  template: '<div data-testid="received-assessment-section-stub"></div>',
  props: {
    assessment: {
      type: Object as PropType<ReceivedAssessmentDTO>,
      required: false,
    },
  },
})
