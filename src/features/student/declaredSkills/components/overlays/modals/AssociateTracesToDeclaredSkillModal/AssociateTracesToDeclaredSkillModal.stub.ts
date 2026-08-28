export const AssociateTracesToDeclaredSkillModalStub = defineComponent({
  name: 'AssociateTracesToDeclaredSkillModal',
  template: '<div data-testid="associate-traces-to-declared-skill-modal-stub"></div>',
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
})
