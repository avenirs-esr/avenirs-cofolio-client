import type { PropType } from 'vue'

export const TraceDeletionConfirmationModalStub = defineComponent({
  name: 'TraceDeletionConfirmationModal',
  props: {
    traceIds: {
      type: Array as PropType<string[]>,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    opened: {
      type: Boolean,
      required: true
    },
    onConfirmDelete: {
      type: Function,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    }
  },
  template: `
    <div
      v-if="opened"
      data-testid="trace-deletion-confirmation-modal"
    >
      <div data-testid="trace-deletion-title">
        {{ title }}
      </div>

      <div data-testid="trace-deletion-ids">
        {{ traceIds.join(',') }}
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
})
