import { defineComponent } from 'vue'

export const ManageToolsDropdownStub = defineComponent({
  name: 'ManageToolsDropdown',
  props: {
    isNational: {
      type: Boolean,
      default: false,
    },
    entityName: String,
  },
  template: '<div data-testid="manage-tools-dropdown-stub" />',
})
