import type { DeclaredActivityTraceAssociationDTO } from '@/api/avenir-esr/generated/types/declaredActivityTraceAssociationDTO'

export const AssociatedTraceCardStub = defineComponent({
  name: 'AssociatedTraceCard',
  props: {
    associatedTrace: {
      type: Object as () => DeclaredActivityTraceAssociationDTO,
      required: true
    },
  },
  template: '<div data-testid="associated-trace-card"></div>'
})
