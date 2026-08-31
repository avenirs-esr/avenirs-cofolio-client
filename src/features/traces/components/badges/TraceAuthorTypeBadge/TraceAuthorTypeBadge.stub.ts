import type { ETraceAuthorType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const TraceAuthorTypeBadgeStub = defineComponent({
  name: 'TraceAuthorTypeBadge',
  template: '<div class="trace-author-type-badge-stub" />',
  props: {
    authorType: { type: String as PropType<ETraceAuthorType>, required: true }
  }
})
