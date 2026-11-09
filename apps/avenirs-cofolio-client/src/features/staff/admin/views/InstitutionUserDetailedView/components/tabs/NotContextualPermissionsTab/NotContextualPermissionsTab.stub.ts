import type { ExternalUserDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
