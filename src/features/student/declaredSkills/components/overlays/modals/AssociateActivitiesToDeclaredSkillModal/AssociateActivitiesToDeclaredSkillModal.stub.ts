export const AssociateActivitiesToDeclaredSkillModalStub = defineComponent({
  name: 'AssociateActivitiesToDeclaredSkillModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    declaredSkillId: {
      type: String,
      required: true
    }
  },
  emits: ['cancel', 'associated'],
  template: `
    <div data-testid="associate-activities-to-declared-skill-modal-stub">
      <slot />
    </div>
  `
})
