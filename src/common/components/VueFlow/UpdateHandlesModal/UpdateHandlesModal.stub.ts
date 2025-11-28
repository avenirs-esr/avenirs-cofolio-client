import type { NodeProps } from '@vue-flow/core'
import type { PropType } from 'vue'

export const UpdateHandlesModalStub = defineComponent({
  name: 'UpdateHandlesModal',
  props: {
    id: { type: String, required: true },
    data: { type: Object as PropType<NodeProps['data']> },
    show: { type: Boolean, required: true },
  },
  template: '<div class="update-handles-modal" />',
})
