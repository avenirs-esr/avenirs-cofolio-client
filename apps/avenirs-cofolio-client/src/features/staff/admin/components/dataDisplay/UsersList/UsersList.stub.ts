import type { PropType } from 'vue'
import type { EUserCategory1 } from '@/api/avenir-esr'

export const UsersListStub = defineComponent({
  name: 'UsersListStub',
  props: {
    categories: {
      type: Array as PropType<EUserCategory1[]>,
      required: false,
    },
    institutionIds: {
      type: Array as PropType<string[]>,
      required: false,
    },
    groupIds: {
      type: Array as PropType<string[]>,
      required: false,
    },
  },
  template: '<div data-testid="users-list-stub" />',
})
