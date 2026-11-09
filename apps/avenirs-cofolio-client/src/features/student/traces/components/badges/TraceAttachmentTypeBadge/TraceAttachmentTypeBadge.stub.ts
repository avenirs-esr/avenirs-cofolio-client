import type { EFileType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const TraceAttachmentTypeBadgeStub = defineComponent({
  name: 'TraceAttachmentTypeBadge',
  template: '<div class="trace-attachment-type-badge-stub" />',
  props: {
    fileType: { type: String as PropType<EFileType>, required: false }
  }
})
