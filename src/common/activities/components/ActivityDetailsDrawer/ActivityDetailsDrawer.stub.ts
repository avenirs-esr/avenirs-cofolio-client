import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityDetailsDrawerStub = defineComponent({
  name: 'ActivityDetailsDrawer',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    activity: {
      type: Object as PropType<ActivityContentDTO>,
      required: true,
    },
  },
  template: '<div data-testid="activity-details-drawer-stub"></div>',
})
