import type { PropType } from 'vue'
import type { GroupOverviewDTO } from '@/api/avenir-esr'

export const GroupsListNameStub = defineComponent({
  name: 'GroupsListNameStub',
  props: {
    group: {
      type: Object as PropType<GroupOverviewDTO>,
      required: true,
    },
  },
  template: '<div data-testid="group-list-table-name">{{ group.name }}</div>',
})
