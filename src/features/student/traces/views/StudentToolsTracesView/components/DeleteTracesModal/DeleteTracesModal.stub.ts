export const DeleteTracesModalStub = {
  name: 'DeleteTracesModal',
  props: ['show', 'totalCount'],
  emits: ['cancel', 'deleted'],
  template: `
    <div
      v-if="show"
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
}
