import type { ActivityContentDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityContentTabStub = defineComponent({
  name: 'ActivityContentTab',
  props: {
    activity: {
      type: Object as PropType<ActivityContentDTO>,
    },
    isSubActivity: Boolean
  },
  template: '<div data-testid="activity-content-tab-stub"><slot /></div>',
})
