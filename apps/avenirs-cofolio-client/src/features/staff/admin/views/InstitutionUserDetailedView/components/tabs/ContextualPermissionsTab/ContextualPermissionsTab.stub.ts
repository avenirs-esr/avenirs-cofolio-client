import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const ContextualPermissionsTabStub = defineComponent({
  name: 'ContextualPermissionsTab',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true,
    },
  },
  template: '<div data-testid="contextual-permissions-tab-stub" />',
})
