import type { DeclaredActivityDetailsDTO, SubActivityOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const SubActivityDetailsStub = defineComponent({
  name: 'SubActivityDetails',
  props: {
    declaredActivityDetails: {
      type: Object as PropType<DeclaredActivityDetailsDTO>,
      required: true,
    },
    subActivity: {
      type: Object as PropType<SubActivityOverviewDTO>,
      required: true,
    },
  },
  template: `
    <div data-testid="sub-activity-details" />
  `,
})
