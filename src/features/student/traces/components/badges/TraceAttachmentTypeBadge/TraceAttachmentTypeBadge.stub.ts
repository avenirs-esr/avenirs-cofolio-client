import type { PropType } from 'vue'
import type { EFileType } from '@/api/avenir-esr'

export const TraceAttachmentTypeBadgeStub = defineComponent({
  name: 'TraceAttachmentTypeBadge',
  template: '<div class="trace-attachment-type-badge-stub" />',
  props: {
    fileType: { type: String as PropType<EFileType>, required: false }
  }
})
