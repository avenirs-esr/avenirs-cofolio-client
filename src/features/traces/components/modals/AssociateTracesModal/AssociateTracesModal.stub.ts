export const AssociateTracesModalStub = defineComponent({
  name: 'AssociateTracesModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    traces: {
      type: Array,
      required: true
    },
    selectedTraceType: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['cancel', 'search', 'associate', 'update:selectedTraceType'],
  template: `
    <div data-testid="associate-traces-modal-stub">
      <slot />
    </div>
  `
})
