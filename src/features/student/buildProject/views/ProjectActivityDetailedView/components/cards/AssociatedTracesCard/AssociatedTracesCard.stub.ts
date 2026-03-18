import type { DeclaredActivityTraceAssociationDTO } from '@/api/avenir-esr'

export const AssociatedTracesCardStub = defineComponent({
  name: 'AssociatedTracesCard',
  props: {
    associatedTraces: {
      type: Array as () => DeclaredActivityTraceAssociationDTO[],
      required: true
    }
  },
  template: `
    <div v-if="associatedTraces.length > 0" data-testid="associated-trace-card">
      <span v-for="trace in associatedTraces" :key="trace.id">{{ trace.name }}</span>
    </div>
  `
})
