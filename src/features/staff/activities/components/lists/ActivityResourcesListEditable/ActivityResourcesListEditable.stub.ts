import type { FileDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityResourcesListEditableStub = defineComponent({
  name: 'ActivityResourcesListEditable',
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
    isFormDirty: Boolean,
    isUpdating: Boolean,
  },
  emits: ['add', 'delete'],
  template: '<div data-testid="activity-resources-list-editable-stub"></div>',
})
