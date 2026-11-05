import type { EActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityRightsSectionStub = defineComponent({
  name: 'ActivityRightsSection',
  template: '<div data-testid="activity-rights-section-stub"></div>',
  emits: ['dirtyChange'],
  props: {
    activityId: {
      type: String,
      required: true,
    },
    status: {
      type: String as PropType<EActivityStatus>,
      required: true,
    },
    canEdit: Boolean,
  },
})
