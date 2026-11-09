import type { ERole } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UserRoleBadgeStub = defineComponent({
  name: 'UserRoleBadge',
  props: {
    role: {
      type: String as PropType<ERole>,
      required: true,
    },
  },
  template: '<div data-testid="user-role-badge-stub" />',
})
