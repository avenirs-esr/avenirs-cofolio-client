import type { EUniverse, ExternalUserDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UserDetailsTableStub = defineComponent({
  name: 'UserDetailsTable',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true,
    },
    universes: {
      type: Array as PropType<EUniverse[]>,
      required: true,
    },
  },
  template: '<div data-testid="user-details-table-stub" />',
})
