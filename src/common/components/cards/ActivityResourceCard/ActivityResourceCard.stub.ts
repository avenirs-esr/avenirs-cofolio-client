import type { ActivityResource } from '@/features/staff/activities/types/resource.types'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ActivityResourceCardStub = defineComponent({
  name: 'ActivityResourceCard',
  props: {
    ...AvInteractivePropsStub,
    activityId: {
      type: String,
      required: true,
    },
    resource: {
      type: [String, Object] as PropType<ActivityResource>,
      required: false,
    },
    isDraft: Boolean,
    tooltipVisible: Boolean,
  },
  template: '<div data-testid="activity-resource-card" />',
})
