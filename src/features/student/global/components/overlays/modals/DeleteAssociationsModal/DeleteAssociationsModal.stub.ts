import type { PropType } from 'vue'

export const DeleteAssociationsModalStub = defineComponent({
  name: 'DeleteAssociationsModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    associations: {
      type: Array as PropType<{ id: string, title: string }[]>,
      required: true
    },
    selectedAssociationIds: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  emits: ['cancel', 'confirmDelete'],
  template: '<div data-testid="delete-associations-modal-stub"><slot /></div>'
})
