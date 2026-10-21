import type { PropType } from 'vue'

export const DeleteAssociationsConfirmModalStub = defineComponent({
  name: 'DeleteAssociationsConfirmModal',
  props: {
    opened: {
      type: Boolean,
      required: true
    },
    associations: {
      type: Array as PropType<{ id: string, title: string }[]>,
      required: true
    }
  },
  emits: ['cancel', 'confirm'],
  template: '<div data-testid="delete-associations-confirm-modal-stub"></div>'
})
