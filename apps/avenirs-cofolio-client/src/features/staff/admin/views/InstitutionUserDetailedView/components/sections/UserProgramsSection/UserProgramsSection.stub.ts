import type { BaseApiException } from '@avenirs-esr/shared'
import type { ExternalUserDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UserProgramsSectionStub = defineComponent({
  name: 'UserProgramsSection',
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
  template: '<div data-testid="user-programs-section-stub" />',
})
