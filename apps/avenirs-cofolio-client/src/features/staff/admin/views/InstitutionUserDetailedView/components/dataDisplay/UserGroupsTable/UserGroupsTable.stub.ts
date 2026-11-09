import type { ExternalUserDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UserGroupsTableStub = defineComponent({
  name: 'UserGroupsTable',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true,
    },
    programMode: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  template: '<div data-testid="user-groups-table-stub" />',
})
