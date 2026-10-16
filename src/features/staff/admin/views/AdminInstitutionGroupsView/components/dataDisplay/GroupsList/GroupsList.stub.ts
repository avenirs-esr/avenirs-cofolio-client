import type { GroupOverviewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const GroupsListStub = defineComponent({
  name: 'GroupsListStub',
  props: {
    groups: {
      type: Array as PropType<GroupOverviewDTO[]>,
      required: true,
    },
  },
  template: '<div data-testid="group-list-stub"></div>',
})
