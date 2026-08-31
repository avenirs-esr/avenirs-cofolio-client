import type { PropType } from 'vue'

export const DeleteActivityAssociatedElementsModalStub = defineComponent({
  name: 'DeleteActivityAssociatedElementsModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    declaredActivityId: {
      type: String,
      required: true,
    },
    associations: {
      type: Array as PropType<{ id: string, title: string }[]>,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-activity-associated-traces-modal-stub" />',
})
