import type { EActivityStatus } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const NationalActivityCatalogPreviewTabStub = defineComponent({
  name: 'NationalActivityCatalogPreviewTab',
  template: '<div data-testid="national-activity-catalog-preview-tab-stub"></div>',
  props: {
    activityId: {
      type: String,
      required: true,
    },
    status: {
      type: String as PropType<EActivityStatus>,
      required: true,
    },
  },
})
