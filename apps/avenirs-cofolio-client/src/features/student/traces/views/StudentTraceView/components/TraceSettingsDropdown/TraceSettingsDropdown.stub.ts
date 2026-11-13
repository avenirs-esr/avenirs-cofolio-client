import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'

export const TraceSettingsDropdownStub = defineComponent({
  name: 'TraceSettingsDropdown',
  props: {
    traceId: {
      type: String,
      required: true,
    },
    downloadDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: [Action.UPDATE, Action.DOWNLOAD, Action.DELETE],
  template: `
    <div data-testid="trace-settings-dropdown">
      <button data-testid="trace-settings-delete" @click="$emit('${Action.DELETE}')">Delete</button>
      <button data-testid="trace-settings-update" @click="$emit('${Action.UPDATE}')">Update</button>
      <button data-testid="trace-settings-download" @click="$emit('${Action.DOWNLOAD}')">Download</button>
    </div>
  `,
})
