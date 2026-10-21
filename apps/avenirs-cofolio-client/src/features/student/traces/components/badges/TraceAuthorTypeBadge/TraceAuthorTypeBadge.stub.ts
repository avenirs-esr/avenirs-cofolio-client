import type { PropType } from 'vue'
import type { ETraceAuthorType } from '@/api/avenir-esr'

export const TraceAuthorTypeBadgeStub = defineComponent({
  name: 'TraceAuthorTypeBadge',
  template: '<div class="trace-author-type-badge-stub" />',
  props: {
    authorType: { type: String as PropType<ETraceAuthorType>, required: true }
  }
})
