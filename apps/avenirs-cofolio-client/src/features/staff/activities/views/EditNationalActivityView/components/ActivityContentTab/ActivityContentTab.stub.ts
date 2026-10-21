import type { PropType } from 'vue'
import type { ActivityContentDTO } from '@/api/avenir-esr'

export const ActivityContentTabStub = defineComponent({
  name: 'ActivityContentTab',
  props: {
    activity: {
      type: Object as PropType<ActivityContentDTO>,
    },
  },
  emits: ['nextStep'],
  template: '<div data-testid="activity-content-tab-stub"></div>',
})
