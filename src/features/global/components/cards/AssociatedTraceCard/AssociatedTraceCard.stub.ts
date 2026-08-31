import type { TraceAssociationDTO } from '@/api/avenir-esr'

export const AssociatedTraceCardStub = defineComponent({
  name: 'AssociatedTraceCard',
  props: {
    associatedTrace: {
      type: Object as () => TraceAssociationDTO,
      required: true
    },
  },
  template: '<div data-testid="associated-trace-card"></div>'
})
