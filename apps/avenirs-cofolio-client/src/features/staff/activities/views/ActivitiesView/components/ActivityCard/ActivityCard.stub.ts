import type { PropType } from 'vue'
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'

export const ActivityCardStub = defineComponent({
  name: 'ActivityCard',
  template: '<div data-testid="activity-card-stub"></div>',
  props: {
    activity: {
      type: Object as PropType<ActivityTableRow>,
      required: true,
    },
    withStatus: Boolean,
  },
})
