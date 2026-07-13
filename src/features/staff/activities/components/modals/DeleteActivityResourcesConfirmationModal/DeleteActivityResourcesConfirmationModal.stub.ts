import type { FileDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteActivityResourcesConfirmationModalStub = defineComponent({
  name: 'DeleteActivityResourcesConfirmationModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    activityId: {
      type: String,
      required: true,
    },
    files: {
      type: Array as PropType<(FileDTO | File)[]>,
      required: true,
    },
    links: {
      type: Array as PropType<string[]>,
      required: true,
    },
    isUpdating: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['cancel', 'confirm'],
  template: '<div data-testid="delete-activity-resources-confirmation-modal-stub"></div>',
})
