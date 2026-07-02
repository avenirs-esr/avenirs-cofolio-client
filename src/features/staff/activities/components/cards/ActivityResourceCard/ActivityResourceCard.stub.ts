import type { ActivityResource } from '@/features/staff/activities/types/resource.types'
import type { PropType } from 'vue'

export const ActivityResourceCardStub = defineComponent({
  name: 'ActivityResourceCard',
  props: {
    resource: {
      type: [String, Object] as PropType<ActivityResource>,
      required: false,
    },
  },
  template: '<div data-testid="activity-resource-card" />',
})
