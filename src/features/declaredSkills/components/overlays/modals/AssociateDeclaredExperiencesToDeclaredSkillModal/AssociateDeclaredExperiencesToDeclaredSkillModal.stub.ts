export const AssociateDeclaredExperiencesToDeclaredSkillModalStub = defineComponent({
  name: 'AssociateDeclaredExperiencesToDeclaredSkillModal',
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
    <div data-testid="associate-declared-experiences-to-declared-skill-modal-stub">
      <slot />
    </div>
  `
})
