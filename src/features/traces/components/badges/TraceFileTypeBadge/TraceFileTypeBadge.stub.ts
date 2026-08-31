import type { EFileType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const TraceFileTypeBadgeStub = defineComponent({
  name: 'TraceFileTypeBadge',
  template: '<div class="trace-file-type-badge-stub" />',
  props: {
    fileType: { type: String as PropType<EFileType>, required: true }
  }
})
