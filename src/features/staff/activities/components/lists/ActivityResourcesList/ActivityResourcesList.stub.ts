import type { FileDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityResourcesListStub = defineComponent({
  name: 'ActivityResourcesList',
  props: {
    files: {
      type: Array as PropType<(File | FileDTO)[]>,
      required: true,
    },
    links: {
      type: Array as PropType<string[]>,
      required: true,
    },
    showAddCard: {
      type: Boolean,
    },
  },
  emits: ['add'],
  template: '<div data-testid="activity-resources-list-stub"></div>',
})
