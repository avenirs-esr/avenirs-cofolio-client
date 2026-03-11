export const DeleteTraceAssociatedSkillsModalStub = defineComponent({
  name: 'DeleteTraceAssociatedSkillsModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-trace-associated-skills-modal-stub" />',
})
