import type { EAuthorization } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AuthorizationTypeBadgeStub = defineComponent({
  name: 'AuthorizationTypeBadge',
  props: {
    type: {
      type: String as PropType<EAuthorization>,
      required: true
    }
  },
  template: `<div data-testid="authorization-type-badge" />`
})
