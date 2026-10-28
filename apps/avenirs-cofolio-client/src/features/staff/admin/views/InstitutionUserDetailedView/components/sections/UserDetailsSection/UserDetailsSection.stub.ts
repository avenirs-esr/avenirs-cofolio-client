import type { BaseApiException } from '@avenirs-esr/shared'
import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const UserDetailsSectionStub = defineComponent({
  name: 'UserDetailsSection',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: false,
    },
    error: {
      type: Object as PropType<BaseApiException | null>,
      required: false,
      default: undefined,
    },
  },
  template: '<div data-testid="user-details-section-stub" />',
})
