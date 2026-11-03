import type { PropType } from 'vue'
import type { ActivityAssessmentDTO } from '@/api/avenir-esr'

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
