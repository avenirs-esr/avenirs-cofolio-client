import type { ReceivedAssessmentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
