export const AssociateActivitiesToTracesModalStub = defineComponent({
  name: 'AssociateActivitiesToTracesModal',
  props: {
    opened: {
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
    <div data-testid="associate-activities-to-traces-modal-stub">
      <slot />
    </div>
  `
})
