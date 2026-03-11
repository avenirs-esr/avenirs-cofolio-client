export const DeleteAssociatedSkillsModalStub = {
  name: 'DeleteAssociatedSkillsModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-associated-skills-modal-stub" />',
}
