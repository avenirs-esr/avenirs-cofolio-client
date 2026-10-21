import type { PropType } from 'vue'
import type { EUniverse, ExternalUserDetailDTO } from '@/api/avenir-esr'

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
