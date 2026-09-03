import type { ActivityItemNavigationDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const FeedbacksDashboardCardsStub = defineComponent({
  name: 'FeedbacksDashboardCards',
  props: {
    activity: Object as PropType<ActivityItemNavigationDTO>,
    totalFeedbacks: Number,
    newFeedbacks: Number,
    unprocessedFeedbacks: Number,
    sentFeedbacks: Number,
  },
  template: '<div data-testid="feedbacks-dashboard-cards-stub" />'
})
