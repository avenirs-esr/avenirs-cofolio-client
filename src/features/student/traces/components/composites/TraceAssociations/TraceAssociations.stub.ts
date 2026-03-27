import type { TraceAssociationsDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const TraceAssociationsStub = defineComponent({
  name: 'TraceAssociations',
  props: {
    associations: { type: Object as PropType<TraceAssociationsDTO>, required: true },
    traceId: { type: String, required: true }
  },
  template: `<div data-testid="trace-associations-stub"></div>`
})
