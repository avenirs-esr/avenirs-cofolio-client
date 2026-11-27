import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const ManageToolsDropdownStub = defineComponent({
  name: 'ManageToolsDropdown',
  props: {
    isNational: {
      type: Boolean,
      default: false,
    },
    entityName: String,
    addInteractiveProps: {
      type: Object as PropType<AvInteractiveProps>,
      required: false,
    },
    deleteInteractiveProps: {
      type: Object as PropType<AvInteractiveProps>,
      required: false,
    },
  },
  template: '<div data-testid="manage-tools-dropdown-stub" />',
})
