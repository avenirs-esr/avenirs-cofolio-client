import type { GroupOverviewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
