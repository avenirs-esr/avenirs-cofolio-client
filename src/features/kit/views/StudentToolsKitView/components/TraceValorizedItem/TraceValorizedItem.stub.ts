import type { TraceViewDTO } from '@/api/avenir-esr'
import type { ValorizedItemType } from '@/features/kit/types/valorized.types'
import type { PropType } from 'vue'

export const TraceValorizedItemStub = defineComponent({
  name: 'TraceValorizedItem',
  template: '<div data-testid="trace-valorized-item-stub" />',
  props: {
    trace: { type: Object as PropType<TraceViewDTO>, required: true },
    type: { type: String as PropType<ValorizedItemType.ASSOCIATED_TRACE | ValorizedItemType.NON_ASSOCIATED_TRACE>, required: true }
  }
})
