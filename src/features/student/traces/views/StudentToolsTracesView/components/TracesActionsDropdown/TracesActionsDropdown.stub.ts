export const TracesActionsDropdownStub = {
  name: 'TracesActionsDropdown',
  emits: ['deleteSelected'],
  template: `
    <div data-testid="traces-actions-dropdown">
      <button
        data-testid="delete-selected"
        @click="$emit('deleteSelected')"
      >
        Delete
      </button>
    </div>
  `
}
