import type { PropType } from 'vue'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'

export const UserNameStub = defineComponent({
  name: 'UserNameStub',
  props: {
    user: {
      type: Object as PropType<UserInfoType>,
      required: true,
    },
    withNav: {
      type: Boolean,
      default: false,
    },
  },
  template: '<div data-testid="user-name">{{ user.lastName }} {{ user.firstName }}</div>',
})
