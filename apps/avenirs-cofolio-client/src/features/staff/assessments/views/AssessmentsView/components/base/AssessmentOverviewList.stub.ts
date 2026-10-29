import type { AvTableColumn } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import type { AssessmentTableRow } from '@/features/staff/assessments/views/AssessmentsView/components/dataDisplay/AssessmentsList/AssessmentsList.types'

export const AssessmentOverviewListStub = defineComponent({
  name: 'AssessmentOverviewList',
  props: {
    rows: {
      type: Array as PropType<AssessmentTableRow[]>,
      required: true,
    },
    columns: {
      type: Array as PropType<AvTableColumn<AssessmentTableRow>[]>,
      required: true,
    },
  },
  template: '<div data-testid="assessment-overview-list-stub" />',
})
