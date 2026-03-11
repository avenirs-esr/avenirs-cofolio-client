export const DeleteActivityAssociatedSkillsModalStub = defineComponent({
  name: 'DeleteActivityAssociatedSkillsModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-activity-associated-skills-modal-stub" />',
})
