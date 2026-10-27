import type { PropType } from 'vue'
import type { ERole } from '@/api/avenir-esr'

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
