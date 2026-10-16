import type { PropType } from 'vue'
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'

export const ActivityTableTitleStub = defineComponent({
  name: 'ActivityTableTitle',
  template: '<div data-testid="activity-table-title-stub"></div>',
  props: {
    activity: {
      type: Object as PropType<ActivityTableRow>,
      required: true,
    },
  },
})
