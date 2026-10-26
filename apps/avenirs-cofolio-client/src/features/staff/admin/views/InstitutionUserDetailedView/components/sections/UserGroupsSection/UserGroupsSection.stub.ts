import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'

export const UserGroupsSectionStub = defineComponent({
  name: 'UserGroupsSection',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: undefined,
    },
    error: {
      type: Object as PropType<BaseApiException | null>,
      default: undefined,
    },
  },
  template: '<div data-testid="user-groups-section-stub" />',
})
