import type { PropType } from 'vue'
import type { GroupOverviewDTO } from '@/api/avenir-esr'

export const GroupOverviewCardStub = defineComponent({
  name: 'GroupOverviewCard',
  template: '<div data-testid="group-overview-card-stub"></div>',
  props: {
    group: {
      type: Object as PropType<GroupOverviewDTO>,
      required: true,
    },
    isSubGroup: {
      type: Boolean,
      required: false,
      default: false
    }
  },
})
