import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'

export const UserLayoutStub = defineComponent({
  name: 'UserLayout',
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
  emits: ['selectedSection'],
  template: `
    <div data-testid="user-layout-stub" />
  `,
})
