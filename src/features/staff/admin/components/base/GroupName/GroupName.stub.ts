import type { PropType } from 'vue'
import type { GroupOverviewDTO } from '@/api/avenir-esr'

export const GroupNameStub = defineComponent({
  name: 'GroupNameStub',
  props: {
    group: {
      type: Object as PropType<GroupOverviewDTO>,
      required: true,
    },
    withNav: {
      type: Boolean,
      default: false,
    }
  },
  template: '<div data-testid="group-name">{{ group.name }}</div>',
})
