import type { DeclaredActivityAssessmentDetailsDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
