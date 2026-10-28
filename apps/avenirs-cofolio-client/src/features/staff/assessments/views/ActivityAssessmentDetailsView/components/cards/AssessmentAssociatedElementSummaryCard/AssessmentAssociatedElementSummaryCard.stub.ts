import type { PropType } from 'vue'
import type { DeclaredActivityAssociationsDTO } from '@/api/avenir-esr'

export const AssessmentAssociatedElementSummaryCardStub = defineComponent({
  name: 'AssessmentAssociatedElementSummaryCard',
  template: '<div data-testid="assessment-associated-element-summary-card-stub"><slot /></div>',
  props: {
    associations: {
      type: Object as PropType<DeclaredActivityAssociationsDTO>,
      required: true,
    },
  },
})
