import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityFeedbacksDashboardStub = defineComponent({
  name: 'ActivityFeedbacksDashboard',
  template: '<div data-testid="activity-feedbacks-dashboard-stub"></div>',
  props: {
    activity: {
      type: Object as PropType<ActivityContentDTO>,
      required: true,
    },
  },
})
