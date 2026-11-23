import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const ToolCardStub = defineComponent({
  name: 'ToolCard',
  props: {
    tool: { type: Object as PropType<ToolDTO>, required: true },
    baseRouteName: { type: String, required: false }
  },
  template: '<div data-testid="tool-card-stub"></div>',
})
