import type { TraceAssociationsDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import type { PropType } from 'vue'

export const TraceAssociationsStub = defineComponent({
  name: 'TraceAssociations',
  props: {
    associations: { type: Object as PropType<TraceAssociationsDTO>, required: true },
    traceId: { type: String, required: true },
    countAssociations: { type: Number, required: false },
    associationsError: { type: Object as PropType<BaseApiException | null>, required: false }
  },
  template: `<div data-testid="trace-associations-stub"></div>`
})
