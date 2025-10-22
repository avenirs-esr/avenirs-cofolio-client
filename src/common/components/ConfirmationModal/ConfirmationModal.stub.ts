export const ConfirmationModalStub = {
  name: 'ConfirmationModal',
  props: {
    show: Boolean,
    title: String,
    description: String,
    closeButtonLabel: String
  },
  emits: ['close', 'confirm'],
  template: `
    <div v-if="show" data-testid="confirmation-modal">
      <slot>
        <div>{{ title }}</div>
        <div>{{ description }}</div>
      </slot>
    </div>
  `
}
