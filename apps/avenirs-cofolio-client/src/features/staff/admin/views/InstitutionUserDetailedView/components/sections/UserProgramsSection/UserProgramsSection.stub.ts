import type { BaseApiException } from '@avenirs-esr/shared'
import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

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
