import type { EGroupType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
