import type { ActivityContentDTO } from 'src/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityFeedbacksCardStub = defineComponent({
  name: 'ActivityFeedbacksCard',
  template: '<div data-testid="activity-feedbacks-card-stub"></div>',
  props: {
    activity: {
      type: Object as PropType<ActivityContentDTO>,
      required: true,
    },
  },
})
