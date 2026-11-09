import type { GroupOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'

export const UsersOverviewCardStub = defineComponent({
  name: 'UsersOverviewCard',
  template: '<div data-testid="users-overview-card-stub"></div>',
  props: {
    user: {
      type: Object as PropType<UserInfoType>,
      required: true,
    },
    formations: {
      type: Array as PropType<GroupOverviewDTO[]>,
      default: () => [],
    },
    groups: {
      type: Array as PropType<GroupOverviewDTO[]>,
      default: () => [],
    },
  },
})
