import type { PropType } from 'vue'
import type { ERole } from '@/api/avenir-esr'

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
