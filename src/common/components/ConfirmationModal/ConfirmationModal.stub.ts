export const ConfirmationModalStub = defineComponent({
  name: 'ConfirmationModal',
  props: {
    show: Boolean,
    title: String,
    description: String,
    showDescription: Boolean,
    closeButtonLabel: String,
    confirmButtonLabel: String,
    confirmButtonIcon: String,
    confirmButtonDisabled: Boolean
  },
  emits: ['close', 'confirm'],
  template: `
    <div v-if="show" data-testid="confirmation-modal">
      <slot name="header" />
      <slot>
        <div>{{ title }}</div>
        <div>{{ description }}</div>
      </slot>
    </div>
  `
})
