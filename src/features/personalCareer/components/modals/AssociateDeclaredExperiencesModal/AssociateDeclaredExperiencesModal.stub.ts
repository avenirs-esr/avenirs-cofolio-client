export const AssociateDeclaredExperiencesModalStub = defineComponent({
  name: 'AssociateDeclaredExperiencesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    experiences: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'search', 'associate'],
  template: `
    <div data-testid="associate-declared-experiences-modal-stub">
      <slot />
    </div>
  `
})
