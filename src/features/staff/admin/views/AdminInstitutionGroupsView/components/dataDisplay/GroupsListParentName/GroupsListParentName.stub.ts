import type { GroupOverviewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const GroupsListParentNameStub = defineComponent({
  name: 'GroupsListParentName',
  props: {
    group: {
      type: Object as PropType<GroupOverviewDTO>,
      required: true,
    },
  },
  template: '<div data-testid="group-list-table-parent-name-stub">{{ group.parentName }}</div>',
})
