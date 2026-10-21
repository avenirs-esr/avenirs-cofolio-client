export const TraceSettingsDropdownStub = {
  name: 'TraceSettingsDropdown',
  props: {
    downloadDisabled: {
      type: Boolean,
      default: false
    },
    isDeletable: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    'delete',
    'update',
    'download'
  ],
  template: `
    <div data-testid="trace-settings-dropdown">
      <button data-testid="trace-settings-delete" @click="$emit('delete')">Delete</button>
      <button data-testid="trace-settings-update" @click="$emit('update')">Update</button>
      <button data-testid="trace-settings-download" @click="$emit('download')">Download</button>
    </div>
  `
}
