import type { PropType } from 'vue'
import type { EActivityRight } from '@/api/avenir-esr'
import type { UserInfoType } from '@/features/staff/admin/types/users.types'

export const ActivityRightsUserRowStub = defineComponent({
  name: 'ActivityRightsUserRow',
  template: '<div data-testid="activity-rights-user-row-stub"></div>',
  props: {
    user: {
      type: Object as PropType<UserInfoType>,
      required: true,
    },
    modelValue: {
      type: Array as PropType<EActivityRight[]>,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'delete'],
})
