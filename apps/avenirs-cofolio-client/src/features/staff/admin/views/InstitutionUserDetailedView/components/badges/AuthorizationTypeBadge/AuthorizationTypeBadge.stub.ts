import type { PropType } from 'vue'
import type { EAuthorization } from '@/api/avenir-esr'

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
