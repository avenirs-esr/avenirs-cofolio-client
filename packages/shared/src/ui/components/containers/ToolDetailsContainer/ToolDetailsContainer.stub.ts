import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const ToolDetailsContainerStub = defineComponent({
  name: 'ToolDetailsContainer',
  props: {
    id: {
      type: String,
      required: true,
    },
    isNational: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  template: '<div data-testid="tool-details-container-stub"></div>',
})
