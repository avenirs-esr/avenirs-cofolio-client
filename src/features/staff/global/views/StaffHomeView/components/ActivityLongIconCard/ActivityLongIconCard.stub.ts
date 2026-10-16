import type { PropType } from 'vue'
import type { ActivityOverviewDTO, DeclaredActivityViewDTO } from '@/api/avenir-esr'

export const ActivityLongIconCardStub = defineComponent({
  name: 'ActivityLongIconCard',
  props: {
    activity: {
      type: Object as PropType<ActivityOverviewDTO | DeclaredActivityViewDTO>,
      required: false
    },
  },
  template: '<div data-testid="activity-long-icon-card-stub"></div>'
})
