import type { TraceAssociationDTO } from '@/api/avenir-esr'

export const AssociatedTraceCardStub = defineComponent({
  name: 'AssociatedTraceCard',
  props: {
    associatedTrace: {
      type: Object as () => TraceAssociationDTO,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  template: '<div data-testid="associated-trace-card"></div>'
})
