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
    'associate-selected',
    'delete-selected',
    'update-selected',
    'download-selected'
  ],
  template: `
    <div data-testid="trace-settings-dropdown">
      <button data-testid="trace-settings-associate" @click="$emit('associate-selected')">Associate</button>
      <button data-testid="trace-settings-delete" @click="$emit('delete-selected')">Delete</button>
      <button data-testid="trace-settings-update" @click="$emit('update-selected')">Update</button>
      <button data-testid="trace-settings-download" @click="$emit('download-selected')">Download</button>
    </div>
  `
}
