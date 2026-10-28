import type { PropType } from 'vue'
import type { DeclaredActivityAssessmentDetailsDTO } from '@/api/avenir-esr'

export const AssessmentManagementFloatingPanelStub = defineComponent({
  name: 'AssessmentManagementFloatingPanel',
  props: {
    assessment: {
      type: Object as PropType<DeclaredActivityAssessmentDetailsDTO>,
      required: true,
    },
    activityTitle: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="assessment-floating-panel-stub" />',
})
