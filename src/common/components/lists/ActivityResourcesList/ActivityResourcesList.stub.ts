import type { FileDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityResourcesListStub = defineComponent({
  name: 'ActivityResourcesList',
  props: {
    activityId: {
      type: String,
      required: true,
    },
    files: {
      type: Array as PropType<(File | FileDTO)[]>,
      required: true,
    },
    links: {
      type: Array as PropType<string[]>,
      required: true,
    },
    readonly: Boolean,
  },
  template: '<div data-testid="activity-resources-list-stub"></div>',
})
