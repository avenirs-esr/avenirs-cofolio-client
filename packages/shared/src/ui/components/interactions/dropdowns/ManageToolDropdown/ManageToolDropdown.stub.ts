import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'
import { defineComponent } from 'vue'

export const ManageToolDropdownStub = defineComponent({
  name: 'ManageToolDropdown',
  props: {
    ...AvInteractivePropsStub,
    tool: {
      type: Object as PropType<ToolDTO>,
      required: true,
    },
  } satisfies Record<string, unknown>,
  template: '<div data-testid="manage-tool-dropdown-stub" />',
})
