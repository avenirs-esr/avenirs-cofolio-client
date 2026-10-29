import type { PropType } from 'vue'
import type { AssessmentTableRow } from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.types'

export const AssessmentOverviewCardStub = defineComponent({
  name: 'AssessmentOverviewCard',
  props: {
    assessment: {
      type: Object as PropType<AssessmentTableRow>,
      required: true,
    },
  },
  template: '<div data-testid="assessment-overview-card-stub" :data-assessment-id="assessment.id">{{ assessment.activityTitle }}</div>',
})
