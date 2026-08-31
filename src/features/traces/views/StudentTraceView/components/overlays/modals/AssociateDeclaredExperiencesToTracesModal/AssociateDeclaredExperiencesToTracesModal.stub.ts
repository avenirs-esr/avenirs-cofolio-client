export const AssociateDeclaredExperiencesToTracesModalStub = defineComponent({
  name: 'AssociateDeclaredExperiencesToTracesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    traceId: {
      type: String,
      required: true
    }
  },
  emits: ['cancel', 'associated'],
  template: `
    <div data-testid="associate-declared-experiences-to-traces-modal-stub">
      <slot />
    </div>
  `
})
