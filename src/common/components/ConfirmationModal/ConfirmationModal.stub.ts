export const ConfirmationModalStub = defineComponent({
  name: 'ConfirmationModal',
  props: {
    opened: Boolean,
    title: String,
    description: String,
    showDescription: Boolean,
    closeButtonLabel: String,
    confirmButtonLabel: String,
    confirmButtonIcon: String,
    confirmButtonDisabled: Boolean,
    isLoading: Boolean
  },
  emits: ['close', 'confirm'],
  template: `
    <div v-if="opened" data-testid="confirmation-modal">
      <slot name="header" />
      <slot>
        <div>{{ title }}</div>
        <div>{{ description }}</div>
      </slot>
    </div>
  `
})
