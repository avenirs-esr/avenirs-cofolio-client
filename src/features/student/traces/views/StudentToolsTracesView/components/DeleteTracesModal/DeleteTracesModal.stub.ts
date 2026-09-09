export const DeleteTracesModalStub = defineComponent({
  name: 'DeleteTracesModal',
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: `
    <div
      v-if="opened"
      data-testid="delete-traces-modal"
    >
      <button
        data-testid="cancel-delete-traces-modal"
        @click="$emit('cancel')"
      >
        Cancel
      </button>

      <button
        data-testid="deleted-delete-traces-modal"
        @click="$emit('deleted')"
      >
        Deleted
      </button>
    </div>
  `
})
