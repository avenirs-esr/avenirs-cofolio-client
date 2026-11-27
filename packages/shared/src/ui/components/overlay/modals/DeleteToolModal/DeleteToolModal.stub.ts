import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const DeleteToolModalStub = defineComponent({
  name: 'DeleteToolModal',
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
    tool: {
      type: Object as PropType<ToolDTO>,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-tool-modal-stub" />',
})
