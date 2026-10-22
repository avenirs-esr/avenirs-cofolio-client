import type { PropType } from 'vue'
import type { EGroupType } from '@/api/avenir-esr'

export const GroupsListStub = defineComponent({
  name: 'GroupsListStub',
  props: {
    keyword: {
      type: String,
      required: false,
    },
    types: {
      type: Array as PropType<EGroupType[]>,
      required: false,
    },
    groupId: {
      type: String,
      required: false,
    }
  },
  template: '<div data-testid="group-list-stub"></div>',
})
