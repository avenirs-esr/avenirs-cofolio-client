import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityPublicationTabStub = defineComponent({
  name: 'ActivityPublicationTab',
  props: {
    activity: {
      type: Object as PropType<ActivityContentDTO>,
    },
  },
  emits: ['published'],
  template: '<div data-testid="activity-publication-tab-stub"></div>',
})
