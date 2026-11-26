import { defineComponent } from 'vue'

export const DeleteToolsModalStub = defineComponent({
  name: 'DeleteToolsModal',
  inheritAttrs: false,
  props: {
    opened: Boolean,
    isNational: Boolean
  },
  emits: ['cancel', 'deleted'],
  template: `
    <div data-testid="delete-tools-modal-stub"></div>
  `
})
