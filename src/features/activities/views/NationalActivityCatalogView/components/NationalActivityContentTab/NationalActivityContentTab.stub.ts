import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const NationalActivityContentTabStub = defineComponent({
  name: 'NationalActivityContentTab',
  template: '<div data-testid="national-activity-content-tab-stub"></div>',
  props: {
    activity: {
      type: Object as PropType<ActivityContentDTO>,
    },
  },
})
