import type { PropType } from 'vue'

export const DeleteDeclaredProgramConfirmModalStub = defineComponent({
  name: 'DeleteDeclaredProgramConfirmModal',
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    declaredProgramIds: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ['close', 'confirm'],
  template: `<div class="delete-declared-program-confirm-modal-stub"></div>`
})
