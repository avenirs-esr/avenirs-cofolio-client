import type { ActivityResource } from '@/features/activities/types/resource.types'
import type { PropType } from 'vue'

export const ActivityResourceCardStub = defineComponent({
  name: 'ActivityResourceCard',
  props: {
    activityId: {
      type: String,
      required: true,
    },
    resource: {
      type: [String, Object] as PropType<ActivityResource>,
      required: false,
    },
    disabled: Boolean,
    tooltipVisible: Boolean,
  },
  template: '<div data-testid="activity-resource-card" />',
})
