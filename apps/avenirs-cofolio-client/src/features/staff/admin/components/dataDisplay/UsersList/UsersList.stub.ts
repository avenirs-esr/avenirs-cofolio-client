import type { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const UsersListStub = defineComponent({
  name: 'UsersListStub',
  props: {
    categories: {
      type: Array as PropType<EUserCategory[]>,
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
    groupUsersMode: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  template: '<div data-testid="users-list-stub"><slot /></div>',
})
