import type { TraceAssociationDTO } from '@/api/avenir-esr'

export const AssociatedTracesCardStub = defineComponent({
  name: 'AssociatedTracesCard',
  props: {
    associatedTraces: {
      type: Array as () => TraceAssociationDTO[],
      required: true
    },
    traceAllowedAssociations: {
      type: Number,
      required: false,
    }
  },
  template: `
    <div v-if="associatedTraces.length > 0" data-testid="associated-trace-card">
      <span v-for="trace in associatedTraces" :key="trace.id">{{ trace.name }}</span>
    </div>
  `
})
