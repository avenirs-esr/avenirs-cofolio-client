import type { ActivityAssessmentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AssessmentInfoCardStub = defineComponent({
  name: 'AssessmentInfoCard',
  props: {
    assessment: {
      type: Object as PropType<ActivityAssessmentDTO>,
      required: false,
    },
  },
  template: '<div data-testid="assessment-info-card" />',
})
