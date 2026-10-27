import type { PropType } from 'vue'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'

export const NotContextualPermissionsTabStub = defineComponent({
  name: 'NotContextualPermissionsTab',
  props: {
    user: {
      type: Object as PropType<ExternalUserDetailDTO>,
      required: true,
    },
  },
  template: '<div data-testid="not-contextual-permissions-tab-stub" />',
})
