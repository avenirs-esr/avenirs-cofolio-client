import type { EToolType } from '#shared/api/avenir-esr/index'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const ToolTypeBadgeStub = defineComponent({
  name: 'ToolTypeBadge',
  props: {
    type: {
      type: String as PropType<EToolType>,
      required: true
    }
  },
  template: `<div data-testid="tool-type-badge" />`
})
