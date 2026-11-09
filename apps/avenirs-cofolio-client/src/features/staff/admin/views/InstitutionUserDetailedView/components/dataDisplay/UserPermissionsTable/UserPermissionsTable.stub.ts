import type { ERole } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UserPermissionsTableStub = defineComponent({
  name: 'UserPermissionsTable',
  props: {
    roles: {
      type: Array as PropType<ERole[]>,
      required: true,
    },
  },
  template: '<div data-testid="user-permissions-table-stub" />',
})
