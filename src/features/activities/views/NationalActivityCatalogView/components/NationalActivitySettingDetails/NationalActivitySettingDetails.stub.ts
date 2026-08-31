import type { ActivityContentDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const NationalActivitySettingDetailsStub = defineComponent({
  name: 'NationalActivitySettingDetails',
  template: '<div data-testid="national-activity-setting-details-stub"></div>',
  props: {
    activity: {
      type: Object as PropType<ActivityContentDTO>,
    },
  },
})
