export const TraceDeletionConfirmationModalStub = {
  name: 'TraceDeletionConfirmationModal',
  props: [
    'traceIds',
    'title',
    'show',
    'onConfirmDelete',
    'onClose'
  ],
  template: `
    <div
      v-if="show"
      data-testid="trace-deletion-confirmation-modal"
    >
      <div data-testid="trace-deletion-title">
        {{ title }}
      </div>

      <button
        data-testid="confirm-delete-success"
        @click="onConfirmDelete"
      >
        Confirm
      </button>

      <button
        data-testid="close-delete"
        @click="onClose"
      >
        Close
      </button>
    </div>
  `
}
