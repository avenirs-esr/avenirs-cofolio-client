import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const UserDetailsSectionStub = defineComponent({
  name: 'UserDetailsSection',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true,
    },
  },
  template: '<div data-testid="user-details-section-stub" />',
})
