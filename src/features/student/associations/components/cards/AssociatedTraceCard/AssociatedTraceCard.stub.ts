import type { TraceAssociationDTO } from '@/api/avenir-esr'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const AssociatedTraceCardStub = defineComponent({
  name: 'AssociatedTraceCard',
  props: {
    ...AvInteractivePropsStub,
    associatedTrace: {
      type: Object as () => TraceAssociationDTO,
      required: true
    },
  },
  template: '<div data-testid="associated-trace-card"></div>'
})
