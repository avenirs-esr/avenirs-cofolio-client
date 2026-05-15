import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

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
