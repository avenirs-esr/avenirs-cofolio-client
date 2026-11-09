import type { DeclaredActivityAssociationsDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
