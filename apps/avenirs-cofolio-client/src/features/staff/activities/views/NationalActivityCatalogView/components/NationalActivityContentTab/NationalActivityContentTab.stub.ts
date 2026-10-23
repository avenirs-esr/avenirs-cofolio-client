import type { PropType } from 'vue'
import type { ActivityContentDTO } from '@/api/avenir-esr'

export const NationalActivityContentTabStub = defineComponent({
  name: 'NationalActivityContentTab',
  template: '<div data-testid="national-activity-content-tab-stub"></div>',
  props: {
    activity: {
      type: Object as PropType<ActivityContentDTO>,
    },
  },
})
