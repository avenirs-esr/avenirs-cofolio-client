export const DeleteTraceAssociatedActivitiesModalStub = defineComponent({
  name: 'DeleteTraceAssociatedActivitiesModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-trace-associated-activities-modal-stub" />',
})
