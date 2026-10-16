import type { PropType } from 'vue'
import type { GroupOverviewDTO } from '@/api/avenir-esr'

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
