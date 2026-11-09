import type { ExternalUserDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
