import type { PropType } from 'vue'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'

export const UserInfoStub = defineComponent({
  name: 'UserInfo',
  props: {
    user: {
      type: Object as PropType<UserInfoType>,
      required: true,
    },
  },
  template: `
    <div data-testid="user-info">
      <div v-if="user.profilePictureId" data-testid="profile-picture" />
      <div v-else data-testid="default-account-icon" />
      <span data-testid="name">{{ user.firstName }} {{ user.lastName }}</span>
      <span v-if="user.email" data-testid="email">{{ user.email }}</span>
    </div>
  `,
})
