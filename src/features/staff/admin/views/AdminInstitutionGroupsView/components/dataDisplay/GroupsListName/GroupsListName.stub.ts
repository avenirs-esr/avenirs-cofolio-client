import type { GroupOverviewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

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
